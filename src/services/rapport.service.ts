import { IRapport } from '../types';
import axios from 'axios';

const baseUrl = 'http://localhost:8008/rapports';  // Remplacez par l'URL de votre API

export class RapportService {
  // Récupérer tous les rapports
  static async getAll(): Promise<IRapport[]> {
    try {
      const response = await axios.get(`${baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rapports:', error);
      throw error;
    }
  }

  // Créer un rapport
  static async create(rapport: IRapport): Promise<IRapport> {
    try {
      const response = await axios.post(`${baseUrl}`, rapport);
      return response.data;
    } catch (error) {
      console.error('Error creating rapport:', error);
      throw error;
    }
  }

  // Mettre à jour un rapport
  static async update(id: number, rapport: IRapport): Promise<IRapport> {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, rapport);
      return response.data;
    } catch (error) {
      console.error('Error updating rapport:', error);
      throw error;
    }
  }

  // Supprimer un rapport
  static async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting rapport:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'un rapport
  static async updateStatus(id: number, status: string): Promise<IRapport> {
    try {
      const response = await axios.patch(`${baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating rapport status:', error);
      throw error;
    }
  }
}
