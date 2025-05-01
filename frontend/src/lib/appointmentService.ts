import api from './api';
import { Appointment, AppointmentStatus } from '../types';

export interface AppointmentFormData {
  patient: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
}

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data.data;
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data;
  },

  createAppointment: async (appointmentData: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post('/appointments', appointmentData);
    return response.data.data;
  },

  updateAppointment: async (id: string, appointmentData: Partial<AppointmentFormData>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data.data;
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data.data;
  },

  getAppointmentsByPatient: async (patientId: string): Promise<Appointment[]> => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data.data;
  }
}; 