import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { IParticipant } from '../interfaces';
import { ParticipantService } from '../services/participant.service';

interface ParticipantContextType {
  participants: IParticipant[];
  selectedParticipant: IParticipant | null;
  loading: boolean;
  error: string | null;
  fetchParticipants: () => Promise<void>;
  addParticipant: (participant: IParticipant) => Promise<IParticipant>;
  updateParticipant: (id: number, participant: IParticipant) => Promise<IParticipant>;
  deleteParticipant: (id: number) => Promise<void>;
  selectParticipant: (participant: IParticipant | null) => void;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);

export const useParticipant = () => {
  const context = useContext(ParticipantContext);
  if (!context) throw new Error('useParticipant must be used within a ParticipantProvider');
  return context;
};

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<IParticipant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ParticipantService.getAll();
      setParticipants(data);
    } catch (err) {
      setError('Error loading participants');
      console.error('Error loading participants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
  }
  , [fetchParticipants]);

  const addParticipant = useCallback(async (participant: IParticipant) => {
    try {
      setLoading(true);
      setError(null);
      const newParticipant = await ParticipantService.create(participant);
      setParticipants(prev => [...prev, newParticipant]);
      return newParticipant;
    } catch (err) {
      setError('Error adding participant');
      console.error('Error adding participant:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParticipant = useCallback(async (id: number, participant: IParticipant) => {
    try {
      setLoading(true);
      setError(null);
      const updatedParticipant = await ParticipantService.update(id, participant);
      setParticipants(prev => prev.map(p => p.id === id ? updatedParticipant : p));
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(updatedParticipant);
      }
      return updatedParticipant;
    } catch (err) {
      setError('Error updating participant');
      console.error('Error updating participant:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedParticipant]);

  const deleteParticipant = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ParticipantService.delete(id);
      setParticipants(prev => prev.filter(p => p.id !== id));
      if (selectedParticipant?.id === id) {
        setSelectedParticipant(null);
      }
    } catch (err) {
      setError('Error deleting participant');
      console.error('Error deleting participant:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedParticipant]);

  const selectParticipant = useCallback((participant: IParticipant | null) => {
    setSelectedParticipant(participant);
  }, []);

  const value = useMemo(() => ({
    participants,
    selectedParticipant,
    loading,
    error,
    fetchParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    selectParticipant,
  }), [
    participants,
    selectedParticipant,
    loading,
    error,
    fetchParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    selectParticipant,
  ]);

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
}