import React from 'react';
import { 
  Building2, 
  MapPin, 
  Package, 
  Users,
  Phone,
  Mail,
  MapPinned,
  FileText,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { IOffre } from '@/interfaces';
import { cn } from '@/lib/utils';

interface OfferDetailsProps {
  offer: IOffre;
  expanded?: boolean;
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ offer, expanded = false }) => {
  return (
    <div className={cn(
      "grid gap-6",
      expanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3",
      "p-6"
    )}>
      {/* Informations principales */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          Informations générales
        </h4>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Dates
            </span>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Création</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(offer.date_creation), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              {offer.date_modification && (
                <div>
                  <p className="text-xs text-gray-500">Dernière modification</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(offer.date_modification), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              )}
              {offer.date_validation && (
                <div>
                  <p className="text-xs text-gray-500">Validation</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(offer.date_validation), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              Entité
            </span>
            <p className="text-sm font-medium text-gray-900">{offer.entity.name}</p>
            <p className="text-xs text-gray-500 mt-1">Code: {offer.entity.code}</p>
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          Informations client
        </h4>
        <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 space-y-4">
          <div>
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5" />
              Client
            </span>
            <p className="text-sm font-medium text-gray-900">{offer.client.nom}</p>
          </div>

          {offer.client.email && (
            <div>
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </span>
              <p className="text-sm text-gray-900">{offer.client.email}</p>
            </div>
          )}

          {offer.client.telephone && (
            <div>
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5" />
                Téléphone
              </span>
              <p className="text-sm text-gray-900">{offer.client.telephone}</p>
            </div>
          )}

          {offer.client.adresse && (
            <div>
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <MapPinned className="w-3.5 h-3.5" />
                Adresse
              </span>
              <p className="text-sm text-gray-900">{offer.client.adresse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Produits et Sites */}
      <div className="space-y-6">
        {/* Produits */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            Produits ({offer.produit.length})
          </h4>
          <div className="space-y-2">
            {offer.produit.map((product) => (
              <div
                key={product.id}
                className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all"
              >
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                  <Package className="w-3 h-3" />
                  {product.code}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sites */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            Sites d'intervention ({offer.sites.length})
          </h4>
          <div className="space-y-2">
            {offer.sites.map((site) => (
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
                {site.description && (
                  <p className="text-xs text-gray-500 mt-1">{site.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;