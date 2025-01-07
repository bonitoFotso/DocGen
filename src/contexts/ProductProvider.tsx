// ProductProvider.tsx
import { createContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { IProduct } from '../types';
import { ProductService } from '../services/product.service.ts';

interface ProductContextType {
  products: IProduct[];
  selectedProduct: IProduct | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: IProduct) => Promise<IProduct>;
  updateProduct: (id: number, product: IProduct) => Promise<IProduct>;
  deleteProduct: (id: number) => Promise<void>;
  selectProduct: (product: IProduct | null) => void;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);



export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Error loading products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }
  , [fetchProducts]);

  const addProduct = useCallback(async (product: IProduct) => {
    try {
      setLoading(true);
      const newProduct = await ProductService.create(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError('Error adding product');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, product: IProduct) => {
    try {
      setLoading(true);
      const updatedProduct = await ProductService.update(id, product);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      if (selectedProduct?.id === id) setSelectedProduct(updatedProduct);
      return updatedProduct;
    } catch (err) {
      setError('Error updating product');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await ProductService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      if (selectedProduct?.id === id) setSelectedProduct(null);
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProduct]);

  const selectProduct = useCallback((product: IProduct | null) => {
    setSelectedProduct(product);
  }, []);

  const value = useMemo(() => ({
    products,
    selectedProduct,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    selectProduct,
  }), [products, selectedProduct, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct, selectProduct]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}