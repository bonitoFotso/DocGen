import { apiClient } from './api';
import { ISite, ISiteC } from '../types';


const SITE_API = 'http://localhost:8008/sites/';

export const SiteService = {
  // Récupérer tous les sites
  getAll: async (): Promise<ISite[]> => {
    const response = await apiClient.get(SITE_API);
    return response.data;
  },

  // Récupérer un site par ID
  getById: async (id: number): Promise<ISite> => {
    const response = await apiClient.get(`${SITE_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau site
  create: async (site: Omit<ISiteC, 'id'>): Promise<ISite> => {
    const response = await apiClient.post(SITE_API, site);
    return response.data;
  },

  // Mettre à jour un site
  update: async (id: number, site: Partial<ISite>): Promise<ISite> => {
    const response = await apiClient.put(`${SITE_API}/${id}`, site);
    return response.data;
  },

  // Supprimer un site
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${SITE_API}/${id}`);
  },

  // Récupérer les sites d'un client
  getByClient: async (clientId: number): Promise<ISite[]> => {
    const response = await apiClient.get(`${SITE_API}/client/${clientId}`);
    return response.data;
  },
}; 