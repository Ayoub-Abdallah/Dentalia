import api from './api';
import type { Treatment } from '../types';

export const treatmentService = {
  getAllTreatments: async (): Promise<Treatment[]> => {
    const response = await api.get('/treatments');
    return response.data.data || [];
  },

  getTreatmentById: async (id: string): Promise<Treatment> => {
    const response = await api.get(`/treatments/${id}`);
    return response.data.data;
  },

  createTreatment: async (treatmentData: Partial<Treatment>): Promise<Treatment> => {
    const response = await api.post('/treatments', treatmentData);
    return response.data.data;
  },

  updateTreatment: async (id: string, treatmentData: Partial<Treatment>): Promise<Treatment> => {
    const response = await api.put(`/treatments/${id}`, treatmentData);
    return response.data.data;
  },

  deleteTreatment: async (id: string): Promise<void> => {
    await api.delete(`/treatments/${id}`);
  },

  getTreatmentsByPatient: async (patientId: string): Promise<Treatment[]> => {
    const response = await api.get(`/treatments/patient/${patientId}`);
    return response.data.data || [];
  },

  getTreatmentStats: async (): Promise<any> => {
    const response = await api.get('/treatments/stats');
    return response.data.data;
  }
}; 