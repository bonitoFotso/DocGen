// Entity Provider
import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { IEntity } from '../interfaces';
import { EntityService } from '../services/entity.service';

interface EntityContextType {
  entities: IEntity[];
  selectedEntity: IEntity | null;
  loading: boolean;
  error: string | null;
  fetchEntities: () => Promise<void>;
  addEntity: (entity: IEntity) => Promise<IEntity>;
  updateEntity: (id: number, entity: IEntity) => Promise<IEntity>;
  deleteEntity: (id: number) => Promise<void>;
  selectEntity: (entity: IEntity | null) => void;
}

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export const useEntity = () => {
  const context = useContext(EntityContext);
  if (!context) throw new Error('useEntity must be used within an EntityProvider');
  return context;
};

export function EntityProvider({ children }: { children: ReactNode }) {
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<IEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await EntityService.getAll();
      setEntities(data);
    } catch (err) {
      setError('Error loading entities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntities();
  }
  , [fetchEntities]);

  const addEntity = useCallback(async (entity: IEntity) => {
    try {
      setLoading(true);
      const newEntity = await EntityService.create(entity);
      setEntities(prev => [...prev, newEntity]);
      return newEntity;
    } catch (err) {
      setError('Error adding entity');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEntity = useCallback(async (id: number, entity: IEntity) => {
    try {
      setLoading(true);
      const updatedEntity = await EntityService.update(id, entity);
      setEntities(prev => prev.map(e => e.id === id ? updatedEntity : e));
      if (selectedEntity?.id === id) setSelectedEntity(updatedEntity);
      return updatedEntity;
    } catch (err) {
      setError('Error updating entity');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEntity]);

  const deleteEntity = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await EntityService.delete(id);
      setEntities(prev => prev.filter(e => e.id !== id));
      if (selectedEntity?.id === id) setSelectedEntity(null);
    } catch (err) {
      setError('Error deleting entity');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedEntity]);

  const selectEntity = useCallback((entity: IEntity | null) => {
    setSelectedEntity(entity);
  }, []);

  const value = useMemo(() => ({
    entities,
    selectedEntity,
    loading,
    error,
    fetchEntities,
    addEntity,
    updateEntity,
    deleteEntity,
    selectEntity,
  }), [entities, selectedEntity, loading, error, fetchEntities, addEntity, updateEntity, deleteEntity, selectEntity]);

  return <EntityContext.Provider value={value}>{children}</EntityContext.Provider>;
}