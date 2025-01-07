import axios from 'axios';
import { IParticipant } from '../types';

const PARTICIPANT_API = 'http://localhost:8008/participants/';

export const ParticipantService = {
  getAll: async (): Promise<IParticipant[]> => {
    const response = await axios.get(PARTICIPANT_API);
    return response.data;
  },

  getByClient: async (clientId: number): Promise<IParticipant[]> => {
    const response = await axios.get(`${PARTICIPANT_API}client/${clientId}`);
    return response.data;
  },

  create: async (participant: IParticipant): Promise<IParticipant> => {
    const response = await axios.post(PARTICIPANT_API, participant);
    return response.data;
  },

  update: async (id: number, participant: IParticipant): Promise<IParticipant> => {
    const response = await axios.put(`${PARTICIPANT_API}${id}`, participant);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${PARTICIPANT_API}${id}`);
  },

  getById: async (id: number): Promise<IParticipant> => {
    const response = await axios.get(`${PARTICIPANT_API}${id}/`);
    return response.data;
  },
}; 