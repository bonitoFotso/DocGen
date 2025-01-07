// services/product.service.ts

import { IProduct } from '../types';
import axios from 'axios';

const BASE_URL = 'http://localhost:8008/products'; // Modifiez cette URL selon votre backend

export const ProductService = {
  async getAll(): Promise<IProduct[]> {
    const response = await axios.get<IProduct[]>(BASE_URL);
    return response.data;
  },

  async getById(id: number): Promise<IProduct> {
    const response = await axios.get<IProduct>(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(product: IProduct): Promise<IProduct> {
    const response = await axios.post<IProduct>(BASE_URL, product);
    return response.data;
  },

  async update(id: number, product: IProduct): Promise<IProduct> {
    const response = await axios.put<IProduct>(`${BASE_URL}/${id}`, product);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
