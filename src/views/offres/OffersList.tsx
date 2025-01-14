import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  ChevronRight, 
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IOffre } from '@/interfaces';
import OfferDetails from './OfferDetails';

interface OffersListProps {
  offers: IOffre[];
  onEdit?: (offer: IOffre) => void;
  onDelete?: (offer: IOffre) => void;
  onValidate?: (offer: IOffre) => void;
  onDuplicate?: (offer: IOffre) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'EN_COURS':
      return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100/50';
    case 'VALIDE':
      return 'bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-100/50';
    case 'BROUILLON':
      return 'bg-gray-50 text-gray-600 border-gray-100 shadow-sm';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-100 shadow-sm';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'EN_COURS':
      return <AlertCircle className="w-4 h-4" />;
    case 'VALIDE':
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const OffersList: React.FC<OffersListProps> = ({ 
  offers,
  onEdit,
  onDelete,
  onValidate,
  onDuplicate
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Ferme le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="divide-y divide-gray-100">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="group hover:bg-gray-50/80 transition-colors"
        >
          {/* En-tête de l'offre */}
          <div className="p-5 flex items-center justify-between">
            <div 
              className="flex items-center gap-6 flex-1 cursor-pointer"
              onClick={() => toggleExpand(offer.id)}
            >
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {offer.reference}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  {format(new Date(offer.date_creation), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </div>
              <div className="hidden md:block flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{offer.client.nom}</p>
                <p className="text-xs text-gray-500 truncate">{offer.entity.name}</p>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {offer.produit.length} produit{offer.produit.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {offer.sites.length} site{offer.sites.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(offer.statut)} flex items-center gap-1.5`}>
                {getStatusIcon(offer.statut)}
                {offer.statut.replace('_', ' ')}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  className="hidden group-hover:flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowDetailsId(offer.id)}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden lg:inline">Détails</span>
                </button>

                {/* Dropdown personnalisé */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === offer.id ? null : offer.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openDropdownId === offer.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                      {offer.statut !== 'VALIDE' && onValidate && (
                        <>
                          <button
                            onClick={() => {
                              onValidate(offer);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Valider
                          </button>
                          <hr className="my-1 border-gray-100" />
                        </>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(offer);
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Modifier
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          onClick={() => {
                            onDuplicate(offer);
                            setOpenDropdownId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Dupliquer
                        </button>
                      )}
                      {onDelete && (
                        <>
                          <hr className="my-1 border-gray-100" />
                          <button
                            onClick={() => {
                              onDelete(offer);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    expandedId === offer.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Détails de l'offre */}
          {expandedId === offer.id && (
            <div className="border-t border-gray-100">
              <OfferDetails offer={offer} />
            </div>
          )}
        </div>
      ))}

      {/* Modal de détails */}
      {showDetailsId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Détails de l'offre</h2>
              <button
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowDetailsId(null)}
              >
                Fermer
              </button>
            </div>
            <div className="p-6">
              <OfferDetails 
                offer={offers.find(o => o.id === showDetailsId)!}
                expanded
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersList;