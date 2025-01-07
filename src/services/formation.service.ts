
import axios from 'axios';
import { IFormation } from '../types';




const FORMATION_API = 'http://localhost:8008/formations/';

export const FormationService = {
  // Récupérer toutes les formations
  getAll: async (): Promise<IFormation[]> => {
    const response = await axios.get(FORMATION_API);
    return response.data;
  },

  // Récupérer les formations par type
  getByType: async (type: 'electric' | 'height'): Promise<IFormation[]> => {
    const response = await axios.get(`${FORMATION_API}type/${type}`);
    return response.data;
  },

  // Créer une nouvelle formation
  create: async (formation: Omit<IFormation, 'id'>): Promise<IFormation> => {
    const response = await axios.post(FORMATION_API, formation);
    return response.data;
  },

  // Mettre à jour une formation
  update: async (id: number, formation: Partial<IFormation>): Promise<IFormation> => {
    const response = await axios.put(`${FORMATION_API}${id}`, formation);
    return response.data;
  },

  // Supprimer une formation
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${FORMATION_API}${id}`);
  },
}; 