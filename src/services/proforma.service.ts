import axios from 'axios';
import { IProforma, DocumentStatus } from '../types';

const API_URL = 'http://localhost:8008/proformas/'; // Remplacez par l'URL de votre backend

export const ProformaService = {
  /**
   * Récupère toutes les proformas.
   * @returns {Promise<IProforma[]>}
   */
  async getAll(): Promise<IProforma[]> {
    const response = await axios.get<IProforma[]>(API_URL);
    return response.data;
  },

  /**
   * Récupère une proforma par son ID.
   * @param id L'ID de la proforma
   * @returns {Promise<IProforma>}
   */
  async getById(id: number): Promise<IProforma> {
    const response = await axios.get<IProforma>(`${API_URL}${id}`);
    return response.data;
  },

  /**
   * Crée une nouvelle proforma.
   * @param proforma Les données de la nouvelle proforma
   * @returns {Promise<IProforma>}
   */
  async create(proforma: IProforma): Promise<IProforma> {
    const response = await axios.post<IProforma>(API_URL, proforma);
    return response.data;
  },

  /**
   * Met à jour une proforma existante.
   * @param id L'ID de la proforma à mettre à jour
   * @param proforma Les nouvelles données de la proforma
   * @returns {Promise<IProforma>}
   */
  async update(id: number, proforma: IProforma): Promise<IProforma> {
    const response = await axios.put<IProforma>(`${API_URL}${id}`, proforma);
    return response.data;
  },

  /**
   * Supprime une proforma par son ID.
   * @param id L'ID de la proforma à supprimer
   * @returns {Promise<void>}
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}${id}`);
  },

  /**
   * Met à jour le statut d'une proforma.
   * @param id L'ID de la proforma
   * @param status Le nouveau statut
   * @returns {Promise<IProforma>}
   */
  async updateStatus(id: number, status: DocumentStatus): Promise<IProforma> {
    const response = await axios.patch<IProforma>(`${API_URL}${id}/status`, { status });
    return response.data;
  },
};
