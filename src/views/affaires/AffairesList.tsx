import React, { useState } from 'react';
import { ChevronRight, FileText, Building2, MapPin, Package, Calendar, CheckCircle2, AlertCircle, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IAffaire } from '../../interfaces';

interface AffairesListProps {
  affaires: IAffaire[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'EN_COURS':
      return 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100/50';
    case 'TERMINE':
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
    case 'TERMINE':
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const AffairesList: React.FC<AffairesListProps> = ({ affaires }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (reference: string) => {
    setExpandedId(expandedId === reference ? null : reference);
  };

  return (
    <div className="space-y-6">
      {affaires.map((affaire) => (
        <div
          key={affaire.reference}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg group"
        >
          {/* En-tête de l'affaire */}
          <div
            onClick={() => toggleExpand(affaire.reference)}
            className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50/80 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {affaire.reference}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(affaire.date_creation), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(affaire.statut)} flex items-center gap-1.5`}>
                {getStatusIcon(affaire.statut)}
                {affaire.statut.replace('_', ' ')}
              </span>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  expandedId === affaire.reference ? 'rotate-90' : ''
                }`}
              />
            </div>
          </div>

          {/* Détails de l'affaire */}
          {expandedId === affaire.reference && (
            <div className="border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Informations principales */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Informations générales
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-3.5 h-3.5" />
                        Entité
                      </span>
                      <p className="text-sm font-medium text-gray-900">{affaire.offre.entity.name}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5" />
                        Client
                      </span>
                      <p className="text-sm font-medium text-gray-900">{affaire.offre.client.nom}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Date de début
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(affaire.date_debut), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Produits */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    Produits
                  </h4>
                  <div className="space-y-2 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    {affaire.offre.produit.map((produit) => (
                      <div
                        key={produit.id}
                        className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all"
                      >
                        <span className="text-sm text-gray-900">{produit.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sites */}
                <div className="space-y-5">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Sites d'intervention
                  </h4>
                  <div className="space-y-2 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    {affaire.offre.sites.map((site) => (
                      <div
                        key={site.id}
                        className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all"
                      >
                        <span className="text-sm text-gray-900">{site.nom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rapports */}
              {affaire.rapports.length > 0 && (
                <div className="border-t border-gray-100 p-6">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Rapports associés
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {affaire.rapports.map((rapport) => (
                      <div
                        key={rapport.id}
                        className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{rapport.reference}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(rapport.statut)}`}>
                            {rapport.statut}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AffairesList;