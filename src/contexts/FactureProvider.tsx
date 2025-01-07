import { createContext, ReactNode, useCallback, useMemo, useState, useContext, useEffect } from 'react';
import { DocumentStatus, IFacture } from '../types';
import { FactureService } from '../services/facture.service.ts';

// Définition du contexte
interface FactureContextType {
  factures: IFacture[];
  selectedFacture: IFacture | null;
  loading: boolean;
  error: string | null;
  fetchFactures: () => Promise<void>;
  addFacture: (facture: IFacture) => Promise<IFacture>;
  updateFacture: (id: number, facture: IFacture) => Promise<IFacture>;
  deleteFacture: (id: number) => Promise<void>;
  selectFacture: (facture: IFacture | null) => void;
  updateStatus: (id: number, status: DocumentStatus) => Promise<IFacture>;
}

const FactureContext = createContext<FactureContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useFacture = () => {
  const context = useContext(FactureContext);
  if (!context) {
    throw new Error('useFacture must be used within a FactureProvider');
  }
  return context;
};

export function FactureProvider({ children }: { children: ReactNode }) {
  const [factures, setFactures] = useState<IFacture[]>([]);
  const [selectedFacture, setSelectedFacture] = useState<IFacture | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFactures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FactureService.getAll();
      setFactures(data);
    } catch (err) {
      setError('Error loading factures');
      console.error('Error loading factures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFactures();
  }
  , [fetchFactures]);

  const addFacture = useCallback(async (facture: IFacture) => {
    try {
      setLoading(true);
      setError(null);
      const newFacture = await FactureService.create(facture);
      setFactures(prev => [...prev, newFacture]);
      return newFacture;
    } catch (err) {
      setError('Error adding facture');
      console.error('Error adding facture:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFacture = useCallback(async (id: number, facture: IFacture) => {
    try {
      setLoading(true);
      setError(null);
      const updatedFacture = await FactureService.update(id, facture);
      setFactures(prev => prev.map(f => (f.id === id ? updatedFacture : f)));
      if (selectedFacture?.id === id) {
        setSelectedFacture(updatedFacture);
      }
      return updatedFacture;
    } catch (err) {
      setError('Error updating facture');
      console.error('Error updating facture:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedFacture]);

  const deleteFacture = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await FactureService.delete(id);
      setFactures(prev => prev.filter(f => f.id !== id));
      if (selectedFacture?.id === id) {
        setSelectedFacture(null);
      }
    } catch (err) {
      setError('Error deleting facture');
      console.error('Error deleting facture:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedFacture]);

  const selectFacture = useCallback((facture: IFacture | null) => {
    setSelectedFacture(facture);
  }, []);

  const updateStatus = useCallback(async (id: number, status: DocumentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedFacture = await FactureService.updateStatus(id, status);
      setFactures(prev => prev.map(f => (f.id === id ? updatedFacture : f)));
      if (selectedFacture?.id === id) {
        setSelectedFacture(updatedFacture);
      }
      return updatedFacture;
    } catch (err) {
      setError('Error updating facture status');
      console.error('Error updating facture status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedFacture]);

  const value = useMemo(
    () => ({
      factures,
      selectedFacture,
      loading,
      error,
      fetchFactures,
      addFacture,
      updateFacture,
      deleteFacture,
      selectFacture,
      updateStatus,
    }),
    [
      factures,
      selectedFacture,
      loading,
      error,
      fetchFactures,
      addFacture,
      updateFacture,
      deleteFacture,
      selectFacture,
      updateStatus,
    ]
  );

  return <FactureContext.Provider value={value}>{children}</FactureContext.Provider>;
}
