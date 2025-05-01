import api from './api';

export interface AppointmentType {
  _id: string;
  name: string;
  description?: string;
  duration: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const appointmentTypeService = {
  getAllAppointmentTypes: async (): Promise<AppointmentType[]> => {
    const response = await api.get('/appointment-types');
    return response.data.data;
  },

  createAppointmentType: async (appointmentTypeData: Partial<AppointmentType>): Promise<AppointmentType> => {
    const response = await api.post('/appointment-types', appointmentTypeData);
    return response.data.data;
  },

  updateAppointmentType: async (id: string, appointmentTypeData: Partial<AppointmentType>): Promise<AppointmentType> => {
    const response = await api.put(`/appointment-types/${id}`, appointmentTypeData);
    return response.data.data;
  },

  deleteAppointmentType: async (id: string): Promise<void> => {
    await api.delete(`/appointment-types/${id}`);
  }
}; 