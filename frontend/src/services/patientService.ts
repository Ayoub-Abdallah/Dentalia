import api from '../lib/api';
import type { Patient } from '../types';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Patient> {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error);
      throw error;
    }
  },

  async create(patient: Omit<Patient, '_id'>): Promise<Patient> {
    try {
      const response = await api.post('/patients', patient);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  async update(id: string, patient: Partial<Patient>): Promise<Patient> {
    try {
      const response = await api.put(`/patients/${id}`, patient);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/patients/${id}`);
    } catch (error) {
      console.error(`Error deleting patient ${id}:`, error);
      throw error;
    }
  }
}; 