import api from './api';
import type { Financial } from '../types';

export const financialService = {
  async getAllFinancials() {
    const response = await api.get('/financial');
    return response.data.data || [];
  },

  async getFinancialSummary() {
    const response = await api.get('/financial/summary');
    return response.data;
  },

  async getFinancialById(id: string) {
    const response = await api.get(`/financial/${id}`);
    return response.data;
  },

  async createFinancial(financialData: Omit<Financial, '_id'>) {
    const response = await api.post('/financial', financialData);
    return response.data;
  },

  async updateFinancial(id: string, financialData: Partial<Financial>) {
    const response = await api.put(`/financial/${id}`, financialData);
    return response.data;
  },

  async deleteFinancial(id: string) {
    const response = await api.delete(`/financial/${id}`);
    return response.data;
  }
}; 