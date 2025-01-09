import { useState, useEffect } from 'react';
import { 
  Plus, 
  GraduationCap, 
  Search, 
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { FormationList } from './FormationList';
import FormationModal from './FormationModal';
import { useFormation } from '@/contexts/FormationProvider';

export function Formations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { formations, fetchFormations } = useFormation();

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  const handleSubmit = async (data: unknown) => {
    console.log('Form submitted:', data);
    await fetchFormations();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFormations();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.affaire.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.affaire.offre.client.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || formation.affaire.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: formations.length,
    enCours: formations.filter(f => f.affaire.statut === 'EN_COURS').length,
    termine: formations.filter(f => f.affaire.statut === 'TERMINE').length,
    brouillon: formations.filter(f => f.affaire.statut === 'BROUILLON').length,
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Formations</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez vos sessions de formation et suivez leur progression
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Formation
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, référence ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Tous les statuts</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
                <option value="BROUILLON">Brouillon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">Total</div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Formations</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">En cours</div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
              <div className="text-xs text-gray-500">Formations actives</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">Terminées</div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-green-600">{stats.termine}</div>
              <div className="text-xs text-gray-500">Formations complétées</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">Brouillons</div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <FileText className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-yellow-600">{stats.brouillon}</div>
              <div className="text-xs text-gray-500">En préparation</div>
            </div>
          </div>
        </div>

        {/* Formation List */}
        {filteredFormations.length > 0 ? (
          <FormationList 
            formations={filteredFormations}
            onUpdate={fetchFormations}
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation trouvée</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              {searchTerm || statusFilter ? 
                "Aucune formation ne correspond à vos critères de recherche. Essayez de modifier vos filtres." :
                "Commencez par créer votre première formation en cliquant sur le bouton 'Nouvelle Formation'."}
            </p>
            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* New Formation Modal */}
        <FormationModal
          formation={null}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}