import type { ReactNode } from 'react';

import { useMemo, useState, useContext, useCallback, createContext, useEffect } from 'react';
import { IClient } from '../interfaces';
import { ClientService } from '../services/client.service';


// Types
interface ClientContextType {
  clients: IClient[];
  selectedClient: IClient | null;
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<IClient, 'id'>) => Promise<IClient>;
  updateClient: (id: number, client: IClient) => Promise<IClient>;
  deleteClient: (id: number) => Promise<void>;
  selectClient: (client: IClient | null) => void;
  refreshClient: (id: number) => Promise<void>;
}

interface ClientProviderProps {
  children: ReactNode;
}

// Contexte
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient doit être utilisé à l intérieur d un ClientProvider');
  }
  return context;
};

// Provider
export function ClientProvider({ children }: ClientProviderProps) {
  // États
  const [clients, setClients] = useState<IClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Méthodes
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ClientService.getAll();
      setClients(data);
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error('Erreur lors du chargement des clients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }
  , [fetchClients]);

  const addClient = useCallback(async (client: Omit<IClient, "id">): Promise<IClient> => {
    try {
      setLoading(true);
      setError(null);
      const newClient = await ClientService.create(client);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      setError('Erreur lors de l\'ajout du client');
      console.error('Erreur lors de l\'ajout du client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClient = useCallback(async (id: number, client: IClient): Promise<IClient> => {
    try {
      setLoading(true);
      setError(null);
      const updatedClient = await ClientService.update(id, client);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));

      // Mettre à jour le client sélectionné si nécessaire
      if (selectedClient?.id === id) {
        setSelectedClient(updatedClient);
      }

      return updatedClient;
    } catch (err) {
      setError('Erreur lors de la mise à jour du client');
      console.error('Erreur lors de la mise à jour du client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  const deleteClient = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await ClientService.delete(id);
      setClients(prev => prev.filter(c => c.id !== id));

      // Désélectionner le client si c'était celui qui était sélectionné
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    } catch (err) {
      setError('Erreur lors de la suppression du client');
      console.error('Erreur lors de la suppression du client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  const selectClient = useCallback((client: IClient | null) => {
    setSelectedClient(client);
  }, []);

  const refreshClient = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const refreshedClient = await ClientService.getById(id);
      setClients(prev => prev.map(c => c.id === id ? refreshedClient : c));

      // Mettre à jour le client sélectionné si nécessaire
      if (selectedClient?.id === id) {
        setSelectedClient(refreshedClient);
      }
    } catch (err) {
      setError('Erreur lors du rafraîchissement du client');
      console.error('Erreur lors du rafraîchissement du client:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  // Valeur du contexte mémorisée
  const value = useMemo(() => ({
    clients,
    selectedClient,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    selectClient,
    refreshClient,
  }), [
    clients,
    selectedClient,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    selectClient,
    refreshClient,
  ]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
} 