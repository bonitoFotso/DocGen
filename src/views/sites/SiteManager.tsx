import React, { useState } from 'react';
import { Site } from '../types/Site';
import { SiteList } from './SiteList';
import { SiteDetails } from './SiteDetails';

// Données de test
const mockSites: Site[] = [
  {
    id: 1,
    nom: "bonaberi",
    localisation: "",
    description: "",
    client: {
      id: 1,
      nom: "sabc",
      email: "",
      telephone: "",
      adresse: ""
    }
  }
];

export function SiteManager() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [sites] = useState<Site[]>(mockSites);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Sites
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {selectedSite ? (
          <SiteDetails
            site={selectedSite}
            onBack={() => setSelectedSite(null)}
          />
        ) : (
          <SiteList
            sites={sites}
            onSelectSite={setSelectedSite}
          />
        )}
      </main>
    </div>
  );
}