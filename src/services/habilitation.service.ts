import type { 
  HabilitationElectrique, 
  HabilitationTravauxHauteur,
  CreateHabilitationElectrique,
  CreateHabilitationTravauxHauteur 
} from 'src/types/client.types';

import axios from 'axios';

const HABILITATION_API = 'http://192.168.1.160:8001/api/habilitations';

export const HabilitationService = {
  // Habilitations électriques
  getAllElectric: async (): Promise<HabilitationElectrique[]> => {
    const response = await axios.get(`${HABILITATION_API}-electriques/`);
    return response.data;
  },

  getElectricByParticipant: async (participantId: number): Promise<HabilitationElectrique[]> => {
    const response = await axios.get(`${HABILITATION_API}-electriques/participant/${participantId}`);
    return response.data;
  },

  createElectric: async (habilitation: CreateHabilitationElectrique): Promise<HabilitationElectrique> => {
    const response = await axios.post(`${HABILITATION_API}-electriques/`, habilitation);
    return response.data;
  },

  // Habilitations travaux en hauteur
  getAllHeight: async (): Promise<HabilitationTravauxHauteur[]> => {
    const response = await axios.get(`${HABILITATION_API}-hauteur/`);
    return response.data;
  },

  getHeightByParticipant: async (participantId: number): Promise<HabilitationTravauxHauteur[]> => {
    const response = await axios.get(`${HABILITATION_API}-hauteur/participant/${participantId}`);
    return response.data;
  },

  createHeight: async (habilitation: CreateHabilitationTravauxHauteur): Promise<HabilitationTravauxHauteur> => {
    const response = await axios.post(`${HABILITATION_API}-hauteur/`, habilitation);
    return response.data;
  },

  // Commun aux deux types
  delete: async (id: number, type: 'electric' | 'height'): Promise<void> => {
    await axios.delete(`${HABILITATION_API}/${type}/${id}`);
  },

  // Récupérer toutes les habilitations électriques par formation
  getAllElectricByFormation: async (formationId: number): Promise<HabilitationElectrique[]> => {
    const response = await axios.get(`${HABILITATION_API}-electriques/par_formation/?formation_id=${formationId}`);
    return response.data;
  },

  // Récupérer toutes les habilitations travaux en hauteur par formation
  getAllHeightByFormation: async (formationId: number): Promise<HabilitationTravauxHauteur[]> => {
    const response = await axios.get(`${HABILITATION_API}-hauteur/par_formation/?formation_id=${formationId}`);
    return response.data;
  },

  updateElectric: async (id: number, habilitation: Partial<HabilitationElectrique>): Promise<HabilitationElectrique> => {
    const response = await axios.put(`${HABILITATION_API}-electriques/${id}/`, habilitation);
    return response.data;
  },

  updateHeight: async (id: number, habilitation: Partial<HabilitationTravauxHauteur>): Promise<HabilitationTravauxHauteur> => {
    const response = await axios.put(`${HABILITATION_API}-hauteur/${id}/`, habilitation);
    return response.data;
  },
}; 

