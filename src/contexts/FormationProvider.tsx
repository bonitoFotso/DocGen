import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { IFormation } from '../interfaces';
import { FormationService } from '../services/formation.service';

interface FormationContextType {
  formations: IFormation[];
  selectedFormation: IFormation | null;
  loading: boolean;
  error: string | null;
  fetchFormations: () => Promise<void>;
  addFormation: (formation: IFormation) => Promise<IFormation>;
  updateFormation: (id: number, formation: IFormation) => Promise<IFormation>;
  deleteFormation: (id: number) => Promise<void>;
  selectFormation: (formation: IFormation | null) => void;
}

const FormationContext = createContext<FormationContextType | undefined>(undefined);

export const useFormation = () => {
  const context = useContext(FormationContext);
  if (!context) throw new Error('useFormation must be used within a FormationProvider');
  return context;
};

export function FormationProvider({ children }: { children: ReactNode }) {
  const [formations, setFormations] = useState<IFormation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<IFormation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FormationService.getAll();
      setFormations(data);
    } catch (err) {
      setError('Error loading formations');
      console.error('Error loading formations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormations();
  }

  , [fetchFormations]);

  const addFormation = useCallback(async (formation: IFormation) => {
    try {
      setLoading(true);
      setError(null);
      const newFormation = await FormationService.create(formation);
      setFormations(prev => [...prev, newFormation]);
      return newFormation;
    } catch (err) {
      setError('Error adding formation');
      console.error('Error adding formation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFormation = useCallback(async (id: number, formation: IFormation) => {
    try {
      setLoading(true);
      setError(null);
      const updatedFormation = await FormationService.update(id, formation);
      setFormations(prev => prev.map(f => f.id === id ? updatedFormation : f));
      if (selectedFormation?.id === id) {
        setSelectedFormation(updatedFormation);
      }
      return updatedFormation;
    } catch (err) {
      setError('Error updating formation');
      console.error('Error updating formation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedFormation]);

  const deleteFormation = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await FormationService.delete(id);
      setFormations(prev => prev.filter(f => f.id !== id));
      if (selectedFormation?.id === id) {
        setSelectedFormation(null);
      }
    } catch (err) {
      setError('Error deleting formation');
      console.error('Error deleting formation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedFormation]);

  const selectFormation = useCallback((formation: IFormation | null) => {
    setSelectedFormation(formation);
  }, []);

  const value = useMemo(() => ({
    formations,
    selectedFormation,
    loading,
    error,
    fetchFormations,
    addFormation,
    updateFormation,
    deleteFormation,
    selectFormation,
  }), [
    formations,
    selectedFormation,
    loading,
    error,
    fetchFormations,
    addFormation,
    updateFormation,
    deleteFormation,
    selectFormation,
  ]);

  return (
    <FormationContext.Provider value={value}>
      {children}
    </FormationContext.Provider>
  );
}