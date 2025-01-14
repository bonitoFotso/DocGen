import { IEntity } from '../interfaces';
import axios from 'axios';

const baseUrl = 'http://192.168.1.160:8008/entities';  // Remplacez par l'URL de votre API

export class EntityService {
  // Récupérer toutes les entités
  static async getAll(): Promise<IEntity[]> {
    try {
      const response = await axios.get(`${baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  }

  // Créer une nouvelle entité
  static async create(entity: IEntity): Promise<IEntity> {
    try {
      const response = await axios.post(`${baseUrl}`, entity);
      return response.data;
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  }

  static async createEntity(entity: { code: string; name: string }): Promise<IEntity> {
    try {
      const response = await axios.post(`${baseUrl}/`, entity);
      return response.data;
    } catch (error) {
      console.error('Error creating entity:', error);
      throw error;
    }
  }

  // Mettre à jour une entité
  static async update(id: number, entity: IEntity): Promise<IEntity> {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, entity);
      return response.data;
    } catch (error) {
      console.error('Error updating entity:', error);
      throw error;
    }
  }

  // Supprimer une entité
  static async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting entity:', error);
      throw error;
    }
  }
}
