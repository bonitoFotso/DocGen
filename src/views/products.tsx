import React, { useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import { Package, Plus, Search, Filter, ArrowUpDown, Trash2, SlidersHorizontal, RefreshCw, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryProductsList from './products/CategoryProductsList';
import ProductList from './products/ProductList';

export function Products() {
  const { products } = useProduct();
  const { categories } = useCategory();
  const [activeTab, setActiveTab] = useState<'categories' | 'list'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortConfig, setSortConfig] = useState<{field: 'name' | 'code'; order: 'asc' | 'desc'}>({
    field: 'name',
    order: 'asc'
  });

  const filteredProducts = React.useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category.id.toString() === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      const comparison = a[sortConfig.field].localeCompare(b[sortConfig.field]);
      return sortConfig.order === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortConfig]);

  const filteredCategories = React.useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !categoryFilter || category.id.toString() === categoryFilter;
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchTerm, categoryFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSortConfig({ field: 'name', order: 'asc' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-gray-700" />
              Gestion des Produits
            </h1>
            <p className="text-gray-500 mt-1">
              {products.length} produit{products.length > 1 ? 's' : ''} au total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Produit
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Total Catégories</div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Package className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{categories.length}</div>
            <div className="text-xs text-gray-500 mt-1">Toutes les catégories</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Total Produits</div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{products.length}</div>
            <div className="text-xs text-gray-500 mt-1">Tous les produits</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Filtrés</div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Search className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-2">{filteredProducts.length}</div>
            <div className="text-xs text-gray-500 mt-1">Résultats de recherche</div>
          </div>
        </div>

        {/* Filtres */}
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96' : 'max-h-0'}`}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres et tri
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="w-4 h-4" />
                Réinitialiser
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={`${sortConfig.field}-${sortConfig.order}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as ['name' | 'code', 'asc' | 'desc'];
                    setSortConfig({ field, order });
                  }}
                  className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
                >
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="code-asc">Code (A-Z)</option>
                  <option value="code-desc">Code (Z-A)</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="space-y-6">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'categories'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Par catégories
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'list'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
              Liste complète
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-8">
            {activeTab === 'categories' && (
              <>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <CategoryProductsList key={category.id} category={category} />
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Aucune catégorie ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'list' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {filteredProducts.length > 0 ? (
                  <ProductList products={filteredProducts} />
                ) : (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}