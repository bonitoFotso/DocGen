import axios from 'axios';
import { DocumentStatus, IAttestationFormation } from '../interfaces';

const baseUrl = 'http://192.168.1.160:8001/attestation-formations';  // Remplacez par l'URL de votre API

export class AttestationFormationService {
  // Récupérer toutes les attestations de formation
  static async getAll(): Promise<IAttestationFormation[]> {
    try {
      const response = await axios.get(`${baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attestation formations:', error);
      throw error;
    }
  }

  // Créer une nouvelle attestation de formation
  static async create(attestation: IAttestationFormation): Promise<IAttestationFormation> {
    try {
      const response = await axios.post(`${baseUrl}`, attestation);
      return response.data;
    } catch (error) {
      console.error('Error creating attestation formation:', error);
      throw error;
    }
  }

  // Mettre à jour une attestation de formation
  static async update(id: number, attestation: IAttestationFormation): Promise<IAttestationFormation> {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, attestation);
      return response.data;
    } catch (error) {
      console.error('Error updating attestation formation:', error);
      throw error;
    }
  }

  // Mettre à jour une attestation de formation
  static async updateStatus(id: number, status: DocumentStatus): Promise<IAttestationFormation> {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, status);
      return response.data;
    } catch (error) {
      console.error('Error updating attestation formation:', error);
      throw error;
    }
  }

  // Supprimer une attestation de formation
  static async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting attestation formation:', error);
      throw error;
    }
  }
}
