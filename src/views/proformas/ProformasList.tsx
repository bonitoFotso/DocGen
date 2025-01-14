import React, { useState } from 'react';
import { FileText, ChevronRight, Tag, Building2, MapPin, Package, CheckCircle2, AlertCircle, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { IProforma } from '@/interfaces';


interface ProformasListProps {
  proformas: IProforma[];
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

const ProformasList: React.FC<ProformasListProps> = ({ proformas }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {proformas.map((proforma) => (
        <div
          key={proforma.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg group"
        >
          {/* En-tête de la proforma */}
          <div
            onClick={() => toggleExpand(proforma.id)}
            className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50/80 transition-colors"
          >
            <div className="flex items-center gap-6">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                <FileText className="w-5 h-5 text-gray-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {proforma.reference}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {format(new Date(proforma.date_creation), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5",
                getStatusColor(proforma.statut)
              )}>
                {getStatusIcon(proforma.statut)}
                {proforma.statut.replace('_', ' ')}
              </span>
              <ChevronRight
                className={cn(
                  "w-5 h-5 text-gray-400 transition-transform duration-300",
                  expandedId === proforma.id && "rotate-90"
                )}
              />
            </div>
          </div>

          {/* Détails de la proforma */}
          {expandedId === proforma.id && (
            <div className="border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Informations principales */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    Informations générales
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-3.5 h-3.5" />
                        Entité
                      </span>
                      <p className="text-sm font-medium text-gray-900">{proforma.entity.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Code: {proforma.entity.code}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5" />
                        Client
                      </span>
                      <p className="text-sm font-medium text-gray-900">{proforma.client.nom}</p>
                      {proforma.client.email && (
                        <p className="text-xs text-gray-500 mt-1">{proforma.client.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Produits */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    Produits
                  </h4>
                  <div className="space-y-2 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    {proforma.offre.produit.map((produit) => (
                      <div
                        key={produit.id}
                        className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all"
                      >
                        <p className="text-sm font-medium text-gray-900">{produit.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                          <Tag className="w-3 h-3" />
                          {produit.code}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sites */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Sites d'intervention
                  </h4>
                  <div className="space-y-2 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    {proforma.offre.sites.map((site) => (
                      <div
                        key={site.id}
                        className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all"
                      >
                        <p className="text-sm font-medium text-gray-900">{site.nom}</p>
                        {site.localisation && (
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3" />
                            {site.localisation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProformasList;