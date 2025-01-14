import React from 'react';
import { MapPin, Building2, Mail, Phone, Home, ArrowLeft, Edit, Trash2, Calendar, Clock } from 'lucide-react';

interface SiteDetailsProps {
  site: Site;
  onBack: () => void;
}

export function SiteDetails({ site, onBack }: SiteDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
          Retour à la liste
        </button>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit size={18} />
            Modifier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={18} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{site.nom}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-blue-500" />
                <span>{site.localisation || 'Aucune localisation'}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} />
                Créé le 01/03/2024
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Clock size={14} />
                Dernière mise à jour il y a 2 jours
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {site.description || 'Aucune description disponible'}
          </p>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Informations du client
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            <div className="flex items-center gap-3 p-4">
              <Building2 size={20} className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Nom du client</div>
                <div className="font-medium text-gray-900">{site.client.nom}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Mail size={20} className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium text-gray-900">{site.client.email || 'Non renseigné'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Phone size={20} className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Téléphone</div>
                <div className="font-medium text-gray-900">{site.client.telephone || 'Non renseigné'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Home size={20} className="text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Adresse</div>
                <div className="font-medium text-gray-900">{site.client.adresse || 'Non renseignée'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}