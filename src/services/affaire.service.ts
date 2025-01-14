import axios from 'axios';
import { IAffaire, IAffaireC } from '../interfaces';

const API = 'http://192.168.1.160:8008/affaires/';

export const AffaireService = {
  getAll: async (): Promise<IAffaire[]> => {
    const response = await axios.get(API);
    return response.data;
  },


  create: async (affaire: IAffaireC): Promise<IAffaire> => {
    const response = await axios.post(API, affaire);
    return response.data;
  },

  update: async (id: number, affaire: Partial<IAffaireC>): Promise<IAffaire> => {
    const response = await axios.put(`${API}${id}`, affaire);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<IAffaire> => {
    const response = await axios.put(`${API}${id}`, status);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API}${id}`);
  },

  getById: async (id: number): Promise<IAffaire> => {
    const response = await axios.get(`${API}${id}/`);
    return response.data;
  },
};