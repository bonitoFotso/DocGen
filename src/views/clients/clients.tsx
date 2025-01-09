import  { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  SlidersHorizontal,
  Trash2,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClientList from './ClientList';
import ClientFormModal from './ClientFormModal';
import { useClient } from '@/contexts/ClientContext';

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: 'nom',
    order: 'asc'
  });

  const { clients } = useClient();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Ajouter la logique de rafraîchissement
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Nom', 'Email', 'Téléphone', 'Adresse'],
      ...clients.map(client => [
        client.nom,
        client.email,
        client.telephone,
        client.adresse
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCreateClient = (data: { 
    nom: string; 
    email: string; 
    telephone: string; 
    adresse: string 
  }) => {
    console.log('Nouveau client:', data);
    // Ajouter la logique de création
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortConfig({ field: 'nom', order: 'asc' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-700" />
              Gestion des Clients
            </h1>
            <p className="text-gray-500 mt-1">
              {clients.length} client{clients.length > 1 ? 's' : ''} au total
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
            <ClientFormModal 
              onSubmit={handleCreateClient}
              buttonVariant="primary"
              buttonClassName="gap-2"
            />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                value={`${sortConfig.field}-${sortConfig.order}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortConfig({ field, order });
                }}
                className="w-full h-10 pl-4 pr-8 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              >
                <option value="nom-asc">Nom (A-Z)</option>
                <option value="nom-desc">Nom (Z-A)</option>
                <option value="email-asc">Email (A-Z)</option>
                <option value="email-desc">Email (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <ClientList 
            clients={clients}
            onEdit={(client) => console.log('Éditer:', client)}
            onDelete={(client) => console.log('Supprimer:', client)}
          />
        </div>
      </div>
    </div>
  );
}