import React from 'react';
import { 
  Users,
  Mail,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IClient } from '@/interfaces';


interface ClientDetailsProps {
  client: IClient;
  expanded?: boolean;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, expanded = false }) => {
  return (
    <div className={cn(
      "grid gap-6",
      expanded ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2",
      "p-6"
    )}>
      {/* Informations de contact */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          Informations de contact
        </h4>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5" />
              Nom
            </span>
            <p className="text-sm font-medium text-gray-900">{client.nom}</p>
          </div>

          {client.email && (
            <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </span>
              <p className="text-sm font-medium text-gray-900">{client.email}</p>
            </div>
          )}

          {client.telephone && (
            <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5" />
                Téléphone
              </span>
              <p className="text-sm font-medium text-gray-900">{client.telephone}</p>
            </div>
          )}

          {client.adresse && (
            <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Adresse
              </span>
              <p className="text-sm font-medium text-gray-900">{client.adresse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          Statistiques
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500">Sites</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">0</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500">Offres</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">0</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500">Affaires</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">0</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-medium text-gray-500">Rapports</span>
            <p className="text-lg font-semibold text-gray-900 mt-1">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;