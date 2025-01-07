import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { IAttestationFormation, DocumentStatus } from '../types/Interfaces';
import { AttestationFormationService } from '../services/attestation-formation.service';

interface AttestationFormationContextType {
  attestations: IAttestationFormation[];
  selectedAttestation: IAttestationFormation | null;
  loading: boolean;
  error: string | null;
  fetchAttestations: () => Promise<void>;
  addAttestation: (attestation: IAttestationFormation) => Promise<IAttestationFormation>;
  updateAttestation: (id: number, attestation: IAttestationFormation) => Promise<IAttestationFormation>;
  deleteAttestation: (id: number) => Promise<void>;
  selectAttestation: (attestation: IAttestationFormation | null) => void;
  updateStatus: (id: number, status: DocumentStatus) => Promise<IAttestationFormation>;
}

const AttestationFormationContext = createContext<AttestationFormationContextType | undefined>(undefined);

export const useAttestationFormation = () => {
  const context = useContext(AttestationFormationContext);
  if (!context) throw new Error('useAttestationFormation must be used within an AttestationFormationProvider');
  return context;
};

export function AttestationFormationProvider({ children }: { children: ReactNode }) {
  const [attestations, setAttestations] = useState<IAttestationFormation[]>([]);
  const [selectedAttestation, setSelectedAttestation] = useState<IAttestationFormation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttestations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AttestationFormationService.getAll();
      setAttestations(data);
    } catch (err) {
      setError('Error loading attestations');
      console.error('Error loading attestations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAttestation = useCallback(async (attestation: IAttestationFormation) => {
    try {
      setLoading(true);
      setError(null);
      const newAttestation = await AttestationFormationService.create(attestation);
      setAttestations(prev => [...prev, newAttestation]);
      return newAttestation;
    } catch (err) {
      setError('Error adding attestation');
      console.error('Error adding attestation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAttestation = useCallback(async (id: number, attestation: IAttestationFormation) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAttestation = await AttestationFormationService.update(id, attestation);
      setAttestations(prev => prev.map(a => a.id === id ? updatedAttestation : a));
      if (selectedAttestation?.id === id) {
        setSelectedAttestation(updatedAttestation);
      }
      return updatedAttestation;
    } catch (err) {
      setError('Error updating attestation');
      console.error('Error updating attestation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAttestation]);

  const deleteAttestation = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await AttestationFormationService.delete(id);
      setAttestations(prev => prev.filter(a => a.id !== id));
      if (selectedAttestation?.id === id) {
        setSelectedAttestation(null);
      }
    } catch (err) {
      setError('Error deleting attestation');
      console.error('Error deleting attestation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAttestation]);

  const selectAttestation = useCallback((attestation: IAttestationFormation | null) => {
    setSelectedAttestation(attestation);
  }, []);

  const updateStatus = useCallback(async (id: number, status: DocumentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAttestation = await AttestationFormationService.updateStatus(id, status);
      setAttestations(prev => prev.map(a => a.id === id ? updatedAttestation : a));
      if (selectedAttestation?.id === id) {
        setSelectedAttestation(updatedAttestation);
      }
      return updatedAttestation;
    } catch (err) {
      setError('Error updating attestation status');
      console.error('Error updating attestation status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAttestation]);

  const value = useMemo(() => ({
    attestations,
    selectedAttestation,
    loading,
    error,
    fetchAttestations,
    addAttestation,
    updateAttestation,
    deleteAttestation,
    selectAttestation,
    updateStatus,
  }), [
    attestations,
    selectedAttestation,
    loading,
    error,
    fetchAttestations,
    addAttestation,
    updateAttestation,
    deleteAttestation,
    selectAttestation,
    updateStatus,
  ]);

  return (
    <AttestationFormationContext.Provider value={value}>
      {children}
    </AttestationFormationContext.Provider>
  );
}