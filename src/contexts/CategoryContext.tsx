/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { ICategory } from '../interfaces.ts';
import { CategoryService } from '../services/category.service.ts';

interface CategoryContextType {
  categories: ICategory[];
  selectedCategory: ICategory | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: ICategory) => Promise<ICategory>;
  updateCategory: (id: number, category: ICategory) => Promise<ICategory>;
  deleteCategory: (id: number) => Promise<void>;
  selectCategory: (category: ICategory | null) => void;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);



export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Error loading categoriesssss');
      console.error('Error loading categoriesssssss:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }
  , [fetchCategories]);
  
  const addCategory = useCallback(async (category: ICategory) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure the code is valid
      if (!/^[A-Z]{3}$/.test(category.code)) {
        throw new Error('Category code must be exactly 3 uppercase letters.');
      }

      const newCategory = await CategoryService.create(category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err: any) {
      setError(err.message || 'Error adding category');
      console.error('Error adding category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: number, category: ICategory) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure the code is valid
      if (!/^[A-Z]{3}$/.test(category.code)) {
        throw new Error('Category code must be exactly 3 uppercase letters.');
      }

      const updatedCategory = await CategoryService.update(id, category);
      setCategories(prev => prev.map(c => (c.id === id ? updatedCategory : c)));
      if (selectedCategory?.id === id) {
        setSelectedCategory(updatedCategory);
      }
      return updatedCategory;
    } catch (err: any) {
      setError(err.message || 'Error updating category');
      console.error('Error updating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await CategoryService.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (selectedCategory?.id === id) {
        setSelectedCategory(null);
      }
    } catch (err) {
      setError('Error deleting category');
      console.error('Error deleting category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const selectCategory = useCallback((category: ICategory | null) => {
    setSelectedCategory(category);
  }, []);

  const value = useMemo(() => ({
    categories,
    selectedCategory,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
  }), [
    categories,
    selectedCategory,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
  ]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}
