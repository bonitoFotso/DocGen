import type { ReactNode } from 'react';

import { useMemo, useState, useContext, useCallback, createContext, useEffect } from 'react';

import { SiteService } from '../services/site.service';
import { ISite, ISiteC } from '../interfaces';


interface SiteContextType {
  sites: ISite[];
  loading: boolean;
  error: string | null;
  selectedSite: ISite | null;
  fetchSites: () => Promise<void>;
  fetchSiteById: (id: number) => Promise<void>;
  createSite: (site: Omit<ISiteC, 'id'>) => Promise<void>;
  updateSite: (id: number, site: Partial<ISite>) => Promise<void>;
  deleteSite: (id: number) => Promise<void>;
  fetchSitesByClient: (clientId: number) => Promise<void>;
  setSelectedSite: (site: ISite | null) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<ISite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<ISite | null>(null);

  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SiteService.getAll();
      setSites(data);
    } catch (err) {
      setError('Erreur lors du chargement des sites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }
  , [fetchSites]);

  const fetchSiteById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await SiteService.getById(id);
      setSelectedSite(data);
    } catch (err) {
      setError('Erreur lors du chargement du site');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSite = useCallback(async (site: Omit<ISiteC, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newSite = await SiteService.create(site);
      setSites((prev) => [...prev, newSite]);
    } catch (err) {
      setError('Erreur lors de la création du site');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSite = useCallback(async (id: number, site: Partial<ISite>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSite = await SiteService.update(id, site);
      setSites((prev) => prev.map((s) => (s.id === id ? updatedSite : s)));
    } catch (err) {
      setError('Erreur lors de la mise à jour du site');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSite = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await SiteService.delete(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du site');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSitesByClient = useCallback(async (clientId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await SiteService.getByClient(clientId);
      setSites(data);
    } catch (err) {
      setError('Erreur lors du chargement des sites du client');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      sites,
      loading,
      error,
      selectedSite,
      fetchSites,
      fetchSiteById,
      createSite,
      updateSite,
      deleteSite,
      fetchSitesByClient,
      setSelectedSite,
    }),
    [
      sites,
      loading,
      error,
      selectedSite,
      fetchSites,
      fetchSiteById,
      createSite,
      updateSite,
      deleteSite,
      fetchSitesByClient,
    ]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite doit être utilisé à l\'intérieur d\'un SiteProvider');
  }
  return context;
} 