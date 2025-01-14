import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { IRapport, DocumentStatus } from '../interfaces.ts';
import { RapportService } from '../services/rapport.service.ts';

interface RapportContextType {
  rapports: IRapport[];
  selectedRapport: IRapport | null;
  loading: boolean;
  error: string | null;
  fetchRapports: () => Promise<void>;
  addRapport: (rapport: IRapport) => Promise<IRapport>;
  updateRapport: (id: number, rapport: IRapport) => Promise<IRapport>;
  deleteRapport: (id: number) => Promise<void>;
  selectRapport: (rapport: IRapport | null) => void;
  updateStatus: (id: number, status: DocumentStatus) => Promise<IRapport>;
}

const RapportContext = createContext<RapportContextType | undefined>(undefined);

export const useRapport = () => {
  const context = useContext(RapportContext);
  if (!context) throw new Error('useRapport must be used within a RapportProvider');
  return context;
};

export function RapportProvider({ children }: { children: ReactNode }) {
  const [rapports, setRapports] = useState<IRapport[]>([]);
  const [selectedRapport, setSelectedRapport] = useState<IRapport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRapports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RapportService.getAll();
      setRapports(data);
    } catch (err) {
      setError('Error loading rapports');
      console.error('Error loading rapports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRapports();
  }
  , [fetchRapports]);

  const addRapport = useCallback(async (rapport: IRapport) => {
    try {
      setLoading(true);
      setError(null);
      const newRapport = await RapportService.create(rapport);
      setRapports(prev => [...prev, newRapport]);
      return newRapport;
    } catch (err) {
      setError('Error adding rapport');
      console.error('Error adding rapport:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRapport = useCallback(async (id: number, rapport: IRapport) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRapport = await RapportService.update(id, rapport);
      setRapports(prev => prev.map(r => r.id === id ? updatedRapport : r));
      if (selectedRapport?.id === id) {
        setSelectedRapport(updatedRapport);
      }
      return updatedRapport;
    } catch (err) {
      setError('Error updating rapport');
      console.error('Error updating rapport:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRapport]);

  const deleteRapport = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await RapportService.delete(id);
      setRapports(prev => prev.filter(r => r.id !== id));
      if (selectedRapport?.id === id) {
        setSelectedRapport(null);
      }
    } catch (err) {
      setError('Error deleting rapport');
      console.error('Error deleting rapport:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRapport]);

  const selectRapport = useCallback((rapport: IRapport | null) => {
    setSelectedRapport(rapport);
  }, []);

  const updateStatus = useCallback(async (id: number, status: DocumentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRapport = await RapportService.updateStatus(id, status);
      setRapports(prev => prev.map(r => r.id === id ? updatedRapport : r));
      if (selectedRapport?.id === id) {
        setSelectedRapport(updatedRapport);
      }
      return updatedRapport;
    } catch (err) {
      setError('Error updating rapport status');
      console.error('Error updating rapport status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRapport]);

  const value = useMemo(() => ({
    rapports,
    selectedRapport,
    loading,
    error,
    fetchRapports,
    addRapport,
    updateRapport,
    deleteRapport,
    selectRapport,
    updateStatus,
  }), [
    rapports,
    selectedRapport,
    loading,
    error,
    fetchRapports,
    addRapport,
    updateRapport,
    deleteRapport,
    selectRapport,
    updateStatus,
  ]);

  return (
    <RapportContext.Provider value={value}>
      {children}
    </RapportContext.Provider>
  );
}