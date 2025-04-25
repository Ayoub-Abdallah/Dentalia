import { api } from '../lib/axios';
import type { TreatmentPlan } from '../types';

export const treatmentPlanService = {
  async getAll(): Promise<TreatmentPlan[]> {
    const response = await api.get('/treatment-plans');
    return response.data;
  },

  async getById(id: string): Promise<TreatmentPlan> {
    const response = await api.get(`/treatment-plans/${id}`);
    return response.data;
  },

  async create(plan: Omit<TreatmentPlan, '_id'>): Promise<TreatmentPlan> {
    const response = await api.post('/treatment-plans', plan);
    return response.data;
  },

  async update(id: string, plan: Partial<TreatmentPlan>): Promise<TreatmentPlan> {
    const response = await api.put(`/treatment-plans/${id}`, plan);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/treatment-plans/${id}`);
  }
}; 