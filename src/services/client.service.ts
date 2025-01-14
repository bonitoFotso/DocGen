import axios from 'axios';
import { IClient } from '../types';

const CLIENT_API = 'http://192.168.1.160:8008/clients/';

export const ClientService = {
  getAll: async (): Promise<IClient[]> => {
    const response = await axios.get(CLIENT_API);
    return response.data;
  },

  getById: async (id: number): Promise<IClient> => {
    const response = await axios.get(`${CLIENT_API}${id}`);
    return response.data;
  },

  create: async (client: Omit<IClient, "id">): Promise<IClient> => {
    const response = await axios.post(CLIENT_API, client);
    return response.data;
  },

  update: async (id: number, client: IClient): Promise<IClient> => {
    const response = await axios.put(`${CLIENT_API}${id}`, client);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${CLIENT_API}${id}`);
  },
}; 