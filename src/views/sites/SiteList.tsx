import { useState } from 'react';
import { MapPin, Building2, Phone, Search, Plus } from 'lucide-react';

interface SiteListProps {
  sites: Site[];
  onSelectSite: (site: Site) => void;
}

export function SiteList({ sites, onSelectSite }: SiteListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter(site => 
    site.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un site ou un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Nouveau Site
        </button>
      </div>

      {filteredSites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-500">Aucun site trouvé</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              onClick={() => onSelectSite(site)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-blue-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{site.nom}</h3>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  #{site.id}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} className="text-blue-500" />
                  <span>{site.localisation || 'Aucune localisation'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={18} className="text-blue-500" />
                  <span>Client: {site.client.nom}</span>
                </div>
                
                {site.client.telephone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} className="text-blue-500" />
                    <span>{site.client.telephone}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium">
                  Voir les détails →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}