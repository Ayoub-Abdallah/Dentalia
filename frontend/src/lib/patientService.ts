import api from './api';
import type { Patient } from '../types';

export const patientService = {
  async getAllPatients() {
    const response = await api.get('/patients');
    return response.data;
  },

  async getPatientById(id: string) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async createPatient(patientData: Omit<Patient, '_id'>) {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  async updatePatient(id: string, patientData: Partial<Patient>) {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  async deletePatient(id: string) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  async searchPatients(query: string) {
    const response = await api.get(`/patients/search?q=${query}`);
    return response.data;
  }
}; 