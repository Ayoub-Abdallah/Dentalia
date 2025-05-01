import api from './api';
import type { Treatment } from '../types';
import { AxiosError } from 'axios';

export const treatmentService = {
  getAllTreatments: async (): Promise<Treatment[]> => {
    const response = await api.get('/treatments');
    return response.data.data || [];
  },

  getTreatmentById: async (id: string): Promise<Treatment> => {
    const response = await api.get(`/treatments/${id}`);
    return response.data.data;
  },

  createTreatment: async (patientId: string, treatmentData: Omit<Treatment, '_id'>): Promise<Treatment> => {
    const response = await api.post(`/treatments/patient/${patientId}`, treatmentData);
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
    console.log('treatmentService.getTreatmentsByPatient called with patientId:', patientId);
    try {
      console.log('Making API call to:', `/treatments/patient/${patientId}`);
      const response = await api.get(`/treatments/patient/${patientId}`);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error in getTreatmentsByPatient:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw error;
    }
  },

  getTreatmentStats: async (): Promise<any> => {
    const response = await api.get('/treatments/stats');
    return response.data.data;
  },

  addPayment: async (treatmentId: string, paymentData: {
    amount: number;
    method: 'cash' | 'credit_card' | 'insurance' | 'bank_transfer';
    notes?: string;
  }): Promise<Treatment> => {
    if (!treatmentId) {
      throw new Error('Treatment ID is required');
    }
    
    const response = await api.post(`/treatments/${treatmentId}/payments`, {
      amount: Number(paymentData.amount),
      method: paymentData.method,
      notes: paymentData.notes || ''
    });
    
    return response.data.data;
  },

  getPaymentHistory: async (treatmentId: string): Promise<{
    paymentHistory: Array<{
      amount: number;
      date: string;
      method: string;
      notes?: string;
    }>;
    totalPaid: number;
    remainingBalance: number;
  }> => {
    const response = await api.get(`/treatments/${treatmentId}/payments`);
    return response.data.data;
  },

  getPatientTreatments: async (patientId: string): Promise<Treatment[]> => {
    console.log('treatmentService.getPatientTreatments called with patientId:', patientId);
    try {
      console.log('Making API call to:', `/treatments/patient/${patientId}`);
      const response = await api.get(`/treatments/patient/${patientId}`);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error in getPatientTreatments:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      throw error;
    }
  }
}; 