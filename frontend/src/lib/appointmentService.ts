import axios from 'axios';
import { Appointment } from '../types';

const API_URL = 'http://localhost:5001/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Type for API data (with patient as string ID)
type AppointmentApiData = Omit<Appointment, '_id' | 'patient'> & {
  patient: string;
};

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    const response = await api.get('/appointments');
    return response.data;
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async createAppointment(appointmentData: AppointmentApiData): Promise<Appointment> {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  async updateAppointment(id: string, appointmentData: Partial<AppointmentApiData>): Promise<Appointment> {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  async deleteAppointment(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  },

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  }
}; 