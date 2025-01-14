import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar,
  Clock,
  FileText,
  Building,
  Briefcase,
  ChevronRight,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Users,
  Globe,
  Mail,
  Phone,
  X
} from 'lucide-react';
import FormationModal from './FormationModal';
import { IFormation } from '@/interfaces';

interface FormationListProps {
  formations: IFormation[];
  onUpdate: () => void;
}

export function FormationList({ formations, onUpdate }: FormationListProps) {
    const [selectedFormation, setSelectedFormation] = useState<IFormation | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'date' | 'client' | 'entity'>('date');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
    const handleCardClick = (formation: IFormation) => {
      if (expandedCard === formation.id) {
        setExpandedCard(null);
      } else {
        setExpandedCard(formation.id);
      }
    };

  const handleEdit = (formation: IFormation) => {
    setSelectedFormation(formation);
    setIsModalOpen(true);
  };

  const filteredAndSortedFormations = useMemo(() => {
    let result = formations;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(formation => 
        formation.titre.toLowerCase().includes(query) ||
        formation.affaire.reference.toLowerCase().includes(query) ||
        formation.affaire.offre.client.nom.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(formation => 
        formation.affaire.statut === statusFilter
      );
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime();
        case 'client':
          return a.affaire.offre.client.nom.localeCompare(b.affaire.offre.client.nom);
        case 'entity':
          return a.affaire.offre.entity.name.localeCompare(b.affaire.offre.entity.name);
        default:
          return 0;
      }
    });
  }, [formations, searchQuery, statusFilter, sortBy]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'EN_COURS':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="w-4 h-4" />,
          label: 'En cours'
        };
      case 'TERMINE':
        return {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Terminé'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Brouillon'
        };
    }
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = Math.abs(endDate.getTime() - startDate.getTime()) / 36e5;
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowSortDropdown(false);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Statut
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setStatusFilter(null);
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('EN_COURS');
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter('TERMINE');
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Terminé
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowStatusDropdown(false);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Trier par
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSortBy('date');
                      setShowSortDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Date
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('client');
                      setShowSortDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Client
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('entity');
                      setShowSortDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Entité
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        {filteredAndSortedFormations.length} formation{filteredAndSortedFormations.length !== 1 ? 's' : ''} trouvée{filteredAndSortedFormations.length !== 1 ? 's' : ''}
      </div>

       {/* Formation Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedFormations.map((formation) => {
          const statusConfig = getStatusConfig(formation.affaire.statut);
          const isHovered = hoveredId === formation.id;
          const isExpanded = expandedCard === formation.id;

          return (
            <div
              key={formation.id}
              className={`group relative bg-white rounded-xl border border-gray-200 transition-all duration-300 ${
                isExpanded ? 'col-span-full shadow-xl scale-100' : 
                isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm hover:shadow-md'
              } cursor-pointer`}
              onClick={() => handleCardClick(formation)}
              onMouseEnter={() => setHoveredId(formation.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`p-6 ${isExpanded ? 'space-y-6' : 'space-y-4'}`}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                  </span>
                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCard(null);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Header */}
                <div>
                  <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors pr-24 ${
                    isExpanded ? 'text-xl' : 'text-lg'
                  }`}>
                    {formation.titre}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-mono">
                    {formation.affaire.reference}
                  </p>
                </div>

                {/* Main Content */}
                <div className={`space-y-4 ${isExpanded ? 'grid grid-cols-2 gap-6' : ''}`}>
                  {/* Date and Time */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900">Horaires</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">
                          {format(new Date(formation.date_debut), 'EEEE d MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span>
                            {format(new Date(formation.date_debut), 'HH:mm')} - 
                            {format(new Date(formation.date_fin), 'HH:mm')}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs font-medium">
                          {formatDuration(formation.date_debut, formation.date_fin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className={`${isExpanded ? 'bg-gray-50 rounded-lg p-4' : ''} space-y-3`}>
                    <h4 className="font-medium text-gray-900">Informations client</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{formation.affaire.offre.client.nom}</span>
                      </div>
                      {formation.affaire.offre.client.adresse && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span>{formation.affaire.offre.client.adresse}</span>
                        </div>
                      )}
                      {isExpanded && (
                        <>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{formation.affaire.offre.client.email || 'Non renseigné'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{formation.affaire.offre.client.telephone || 'Non renseigné'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <>
                      {/* Entity Info */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-gray-900">Entité</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{formation.affaire.offre.entity.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Globe className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{formation.affaire.offre.entity.name || 'Non renseigné'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Products Info */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-gray-900">Produits</h4>
                        <div className="space-y-2">
                          {formation.affaire.offre.produit.map((product, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <Briefcase className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                              <span>{product.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Participants Info */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-gray-900">Participants</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{formation.id || 0} participants</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(formation);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all group/button"
                  >
                    <FileText className="w-4 h-4 mr-2 transition-transform group-hover/button:scale-110" />
                    {isExpanded ? 'Modifier' : 'Détails'}
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/button:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 rounded-xl border-2 border-blue-500 opacity-0 transition-opacity duration-200 pointer-events-none ${
                isHovered && !isExpanded ? 'opacity-100' : ''
              }`} />
            </div>
          );
        })}
      </div>

      <FormationModal
        formation={selectedFormation}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFormation(null);
        }}
        onSubmit={() => {
          onUpdate();
          setIsModalOpen(false);
          setSelectedFormation(null);
        }}
      />
    </div>
  );
}