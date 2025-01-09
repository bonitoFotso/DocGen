import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOffre } from '../../contexts/OffreProvider';
import { IOffreC } from '../../types';
import OffersList from './OffersList';
import { Modal } from '@/components/ui/modal';
import OfferForm from '@/components/forms/OfferForm';


export function Offres() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffre, setEditingOffre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: 'date_creation',
    order: 'desc'
  });

  const { offres, addOffre, fetchOffres } = useOffre();

  useEffect(() => {
    fetchOffres();
  }, [fetchOffres]);

  const handleSubmit = (offreData: IOffreC) => {
    addOffre(offreData);
    fetchOffres();
    setIsModalOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOffres();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Référence', 'Date de création', 'Statut', 'Client', 'Entité', 'Produits', 'Sites'],
      ...offres.map(offre => [
        offre.reference,
        new Date(offre.date_creation).toLocaleDateString(),
        offre.statut,
        offre.client.nom,
        offre.entity.name,
        offre.produit.map(p => p.name).join('; '),
        offre.sites.map(s => s.nom).join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `offres_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-700" />
              Gestion des Offres
            </h1>
            <p className="text-gray-500 mt-1">
              {offres.length} offre{offres.length > 1 ? 's' : ''} au total
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
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
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
              onClick={() => {
                setEditingOffre(null);
                setIsModalOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Offre
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Total</div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">{offres.length}</div>
            <div className="text-xs text-gray-500 mt-1">Toutes les offres</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">En cours</div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">
              {offres.filter(o => o.statut === 'EN_COURS').length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Offres actives</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Validées</div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {offres.filter(o => o.statut === 'VALIDE').length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Offres validées</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">Brouillons</div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-600 mt-2">
              {offres.filter(o => o.statut === 'BROUILLON').length}
            </div>
            <div className="text-xs text-gray-500 mt-1">En préparation</div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
              >
                <option value="">Tous les statuts</option>
                <option value="EN_COURS">En cours</option>
                <option value="VALIDE">Validé</option>
                <option value="BROUILLON">Brouillon</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
              >
                <option value="">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
              </select>

              <select
                value={`${sortConfig.field}-${sortConfig.order}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortConfig({ field, order });
                }}
                className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
              >
                <option value="date_creation-desc">Date (récent)</option>
                <option value="date_creation-asc">Date (ancien)</option>
                <option value="reference-asc">Référence (A-Z)</option>
                <option value="reference-desc">Référence (Z-A)</option>
                <option value="client-asc">Client (A-Z)</option>
                <option value="client-desc">Client (Z-A)</option>
                <option value="statut-asc">Statut (A-Z)</option>
                <option value="statut-desc">Statut (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <OffersList offers={offres} />
        </div>

        {/* Modal pour le formulaire */}
        <Modal
          isOpen={isModalOpen}
          size="xl"
          onClose={() => {
            setIsModalOpen(false);
            setEditingOffre(null);
          }}
          title={editingOffre ? 'Modifier l\'offre' : 'Nouvelle offre'}
        >
          <OfferForm
            onSubmit={handleSubmit}
            initialData={editingOffre || undefined}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
}