// OffreProvider.tsx
import { IOffre, DocumentStatus, IOffreC } from '../types';
import { OffreService } from '../services/offre.service';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface OffreContextType {
  offres: IOffre[];
  selectedOffre: IOffre | null;
  loading: boolean;
  error: string | null;
  fetchOffres: () => Promise<void>;
  addOffre: (offre: IOffreC) => Promise<IOffre>;
  updateOffre: (id: number, offre: IOffreC) => Promise<IOffre>;
  deleteOffre: (id: number) => Promise<void>;
  selectOffre: (offre: IOffre | null) => void;
  updateStatus: (id: number, status: DocumentStatus) => Promise<IOffre>;
}

const OffreContext = createContext<OffreContextType | undefined>(undefined);

export const useOffre = () => {
  const context = useContext(OffreContext);
  if (!context) throw new Error('useOffre must be used within an OffreProvider');
  return context;
};

export function OffreProvider({ children }: { children: ReactNode }) {
  const [offres, setOffres] = useState<IOffre[]>([]);
  const [selectedOffre, setSelectedOffre] = useState<IOffre | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OffreService.getAll();
      setOffres(data);
    } catch (err) {
      setError('Error fetching offres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffres();
  }
  , [fetchOffres]);

  const addOffre = useCallback(async (offre: IOffreC) => {
    try {
      setLoading(true);
      setError(null);
      const newOffre = await OffreService.create(offre);
      setOffres(prev => [...prev, newOffre]);
      return newOffre;
    } catch (err) {
      setError('Error adding offre');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOffre = useCallback(async (id: number, offre: IOffreC) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOffre = await OffreService.update(id, offre);
      setOffres(prev => prev.map(o => (o.id === id ? updatedOffre : o)));
      if (selectedOffre?.id === id) setSelectedOffre(updatedOffre);
      return updatedOffre;
    } catch (err) {
      setError('Error updating offre');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedOffre]);

  const deleteOffre = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await OffreService.delete(id);
      setOffres(prev => prev.filter(o => o.id !== id));
      if (selectedOffre?.id === id) setSelectedOffre(null);
    } catch (err) {
      setError('Error deleting offre');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedOffre]);

  const selectOffre = useCallback((offre: IOffre | null) => {
    setSelectedOffre(offre);
  }, []);

  const updateStatus = useCallback(async (id: number, status: DocumentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedOffre = await OffreService.updateStatus(id, status);
      setOffres(prev => prev.map(o => (o.id === id ? updatedOffre : o)));
      if (selectedOffre?.id === id) setSelectedOffre(updatedOffre);
      return updatedOffre;
    } catch (err) {
      setError('Error updating offre status');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedOffre]);

  const value = useMemo(() => ({
    offres,
    selectedOffre,
    loading,
    error,
    fetchOffres,
    addOffre,
    updateOffre,
    deleteOffre,
    selectOffre,
    updateStatus,
  }), [offres, selectedOffre, loading, error, fetchOffres, addOffre, updateOffre, deleteOffre, selectOffre, updateStatus]);

  return <OffreContext.Provider value={value}>{children}</OffreContext.Provider>;
}
