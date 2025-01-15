import React from 'react';
import { OffreBase } from '@/interfaces';
import { Building2, Calendar, Loader2, Trash2, Pencil, ArrowUpDown, CheckCircle2, AlertCircle, Clock, Send } from 'lucide-react';
import { useSortableData } from '@/hooks/useSortableData';
import { formatDate } from '@/utils/dateHelpers';

interface OffreTableProps {
  offres: OffreBase[];
  isLoading: boolean;
  onViewDetails: (offre: OffreBase) => void;
  onEdit: (offre: OffreBase) => void;
  onDelete: (id: number) => void;
  isDeleting: number | null;
}

export const OffreTable: React.FC<OffreTableProps> = ({
  offres,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const { items: sortedOffres, requestSort } = useSortableData(offres, {
    key: 'date_creation',
    direction: 'desc',
  });

  const columns = [
    { key: 'reference', label: 'Référence' },
    { key: 'client_nom', label: 'Client' },
    { key: 'date_creation', label: 'Date Création' },
    { key: 'statut', label: 'Statut' },
    { key: 'actions', label: 'Actions' },
  ];

  if (isLoading && !offres.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  function getStatusBadgeClass(statut: string) {
    switch (statut.toUpperCase()) {
      case 'BROUILLON':
        return 'bg-yellow-100 text-yellow-800';
      case 'VALIDÉ':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'ENVOYÉ':
        return 'bg-purple-100 text-purple-800';
      case 'REFUSÉ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusIcon(statut: string): React.ReactNode {
    switch (statut.toUpperCase()) {
      case 'BROUILLON':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'VALIDÉ':
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case 'EN_COURS':
        return <Loader2 className="h-3 w-3 mr-1" />;
      case 'ENVOYÉ':
        return <Send className="h-3 w-3 mr-1" />;
      case 'REFUSÉ':
        return <AlertCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  }

  function getStatusLabel(statut: string): string {
    switch (statut.toUpperCase()) {
      case 'BROUILLON':
        return 'Brouillon';
      case 'VALIDÉ':
        return 'Validé';
      case 'EN_COURS':
        return 'En cours';
      case 'ENVOYÉ':
        return 'Envoyé';
      case 'REFUSÉ':
        return 'Refusé';
      default:
        return statut;
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(({ key, label }) => (
              <th key={key} className="px-6 py-4 text-left">
                <button
                  onClick={() => key !== 'actions' && requestSort(key)}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider group"
                >
                  {label}
                  {key !== 'actions' && (
                    <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedOffres.map((offre: OffreBase) => (
            <tr
              key={offre.id}
              onClick={() => onViewDetails(offre)}
              className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{offre.reference}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{offre.id}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(offre.date_creation)}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    offre.statut
                  )}`}
                >
                  {getStatusIcon(offre.statut)}
                  {getStatusLabel(offre.statut)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(offre);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(offre.id);
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    disabled={isDeleting === offre.id}
                  >
                    {isDeleting === offre.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};