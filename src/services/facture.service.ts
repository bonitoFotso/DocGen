// FactureService.ts
import axios from 'axios';
import { IFacture, DocumentStatus } from '../interfaces';

const API_URL = 'http://192.168.1.160:8008/factures/'; // Remplacez par l'URL de votre backend

export const FactureService = {
  /**
   * Récupère toutes les factures.
   * @returns {Promise<IFacture[]>}
   */
  async getAll(): Promise<IFacture[]> {
    const response = await axios.get<IFacture[]>(API_URL);
    return response.data;
  },

  /**
   * Récupère une facture par son ID.
   * @param id L'ID de la facture
   * @returns {Promise<IFacture>}
   */
  async getById(id: number): Promise<IFacture> {
    const response = await axios.get<IFacture>(`${API_URL}${id}`);
    return response.data;
  },

  /**
   * Crée une nouvelle facture.
   * @param facture Les données de la nouvelle facture
   * @returns {Promise<IFacture>}
   */
  async create(facture: IFacture): Promise<IFacture> {
    const response = await axios.post<IFacture>(API_URL, facture);
    return response.data;
  },

  /**
   * Met à jour une facture existante.
   * @param id L'ID de la facture à mettre à jour
   * @param facture Les nouvelles données de la facture
   * @returns {Promise<IFacture>}
   */
  async update(id: number, facture: IFacture): Promise<IFacture> {
    const response = await axios.put<IFacture>(`${API_URL}${id}`, facture);
    return response.data;
  },

  /**
   * Supprime une facture par son ID.
   * @param id L'ID de la facture à supprimer
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}${id}`);
  },

  /**
   * Met à jour le statut d'une facture.
   * @param id L'ID de la facture
   * @param status Le nouveau statut
   * @returns {Promise<IFacture>}
   */
  async updateStatus(id: number, status: DocumentStatus): Promise<IFacture> {
    const response = await axios.patch<IFacture>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },
};
