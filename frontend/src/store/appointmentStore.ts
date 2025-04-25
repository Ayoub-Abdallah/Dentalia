import { create } from 'zustand';
import { Appointment } from '../types';
import { appointmentService } from '../lib/appointmentService';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  setAppointments: (appointments: Appointment[]) => void;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  error: null,
  setAppointments: (appointments) => set({ appointments }),
  fetchAppointments: async () => {
    try {
      set({ loading: true, error: null });
      const appointments = await appointmentService.getAllAppointments();
      set({ appointments, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch appointments',
        loading: false 
      });
    }
  },
  addAppointment: (appointment) => 
    set((state) => ({ 
      appointments: [...state.appointments, appointment] 
    })),
  updateAppointment: (id, updatedAppointment) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app._id === id ? updatedAppointment : app
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((app) => app._id !== id),
    })),
})); 