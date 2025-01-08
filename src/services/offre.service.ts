import axios from 'axios';
import { IOffre, IOffreC } from '../types';

const OFFRE_API = 'http://localhost:8008/offres/';

export const OffreService = {
  getAll: async (): Promise<IOffre[]> => {
    const response = await axios.get(OFFRE_API);
    return response.data;
  },


  create: async (offre: IOffreC): Promise<IOffre> => {
    const response = await axios.post(OFFRE_API, offre);
    return response.data;
  },

  update: async (id: number, offre: IOffreC): Promise<IOffre> => {
    const response = await axios.put(`${OFFRE_API}${id}/`, offre);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<IOffre> => {
    const response = await axios.put(`${OFFRE_API}${id}`, status);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${OFFRE_API}${id}`);
  },

  getById: async (id: number): Promise<IOffre> => {
    const response = await axios.get(`${OFFRE_API}${id}/`);
    return response.data;
  },
};