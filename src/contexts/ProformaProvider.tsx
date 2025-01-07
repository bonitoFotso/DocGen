import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { IProforma, DocumentStatus } from '../types';
import { ProformaService } from '../services/proforma.service.ts';

interface ProformaContextType {
  proformas: IProforma[];
  selectedProforma: IProforma | null;
  loading: boolean;
  error: string | null;
  fetchProformas: () => Promise<void>;
  addProforma: (proforma: IProforma) => Promise<IProforma>;
  updateProforma: (id: number, proforma: IProforma) => Promise<IProforma>;
  deleteProforma: (id: number) => Promise<void>;
  selectProforma: (proforma: IProforma | null) => void;
  updateStatus: (id: number, status: DocumentStatus) => Promise<IProforma>;
}

const ProformaContext = createContext<ProformaContextType | undefined>(undefined);

export const useProforma = () => {
  const context = useContext(ProformaContext);
  if (!context) throw new Error('useProforma must be used within a ProformaProvider');
  return context;
};

export function ProformaProvider({ children }: { children: ReactNode }) {
  const [proformas, setProformas] = useState<IProforma[]>([]);
  const [selectedProforma, setSelectedProforma] = useState<IProforma | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProformas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProformaService.getAll();
      setProformas(data);
    } catch (err) {
      setError('Error loading proformas');
      console.error('Error loading proformas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProformas();
  }
  , [fetchProformas]);

  const addProforma = useCallback(async (proforma: IProforma) => {
    try {
      setLoading(true);
      setError(null);
      const newProforma = await ProformaService.create(proforma);
      setProformas(prev => [...prev, newProforma]);
      return newProforma;
    } catch (err) {
      setError('Error adding proforma');
      console.error('Error adding proforma:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProforma = useCallback(async (id: number, proforma: IProforma) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProforma = await ProformaService.update(id, proforma);
      setProformas(prev => prev.map(p => p.id === id ? updatedProforma : p));
      if (selectedProforma?.id === id) {
        setSelectedProforma(updatedProforma);
      }
      return updatedProforma;
    } catch (err) {
      setError('Error updating proforma');
      console.error('Error updating proforma:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProforma]);

  const deleteProforma = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ProformaService.delete(id);
      setProformas(prev => prev.filter(p => p.id !== id));
      if (selectedProforma?.id === id) {
        setSelectedProforma(null);
      }
    } catch (err) {
      setError('Error deleting proforma');
      console.error('Error deleting proforma:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProforma]);

  const selectProforma = useCallback((proforma: IProforma | null) => {
    setSelectedProforma(proforma);
  }, []);

  const updateStatus = useCallback(async (id: number, status: DocumentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProforma = await ProformaService.updateStatus(id, status);
      setProformas(prev => prev.map(p => p.id === id ? updatedProforma : p));
      if (selectedProforma?.id === id) {
        setSelectedProforma(updatedProforma);
      }
      return updatedProforma;
    } catch (err) {
      setError('Error updating proforma status');
      console.error('Error updating proforma status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedProforma]);

  const value = useMemo(() => ({
    proformas,
    selectedProforma,
    loading,
    error,
    fetchProformas,
    addProforma,
    updateProforma,
    deleteProforma,
    selectProforma,
    updateStatus,
  }), [
    proformas,
    selectedProforma,
    loading,
    error,
    fetchProformas,
    addProforma,
    updateProforma,
    deleteProforma,
    selectProforma,
    updateStatus,
  ]);

  return (
    <ProformaContext.Provider value={value}>
      {children}
    </ProformaContext.Provider>
  );
}
