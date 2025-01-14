// services/category.service.ts

import axios from 'axios';
import { ICategory } from '../types';

const BASE_URL = 'http://192.168.1.160:8008/categories'; // Changez cette URL selon votre backend

export const CategoryService = {
  async getAll(): Promise<ICategory[]> {
    const response = await axios.get<ICategory[]>(BASE_URL);
    return response.data;
  },

  async getById(id: number): Promise<ICategory> {
    const response = await axios.get<ICategory>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(category: ICategory): Promise<ICategory> {
    const response = await axios.post<ICategory>(BASE_URL, category);
    return response.data;
  },

  async update(id: number, category: ICategory): Promise<ICategory> {
    const response = await axios.put<ICategory>(`${BASE_URL}/${id}`, category);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
