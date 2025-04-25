import { create } from 'zustand';
import { patientService } from '../lib/patientService';
import { Patient } from '../types';

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  getPatient: (id: string) => Promise<void>;
  createPatient: (patient: Omit<Patient, '_id'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const patients = await patientService.getAllPatients();
      set({ patients, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch patients', isLoading: false });
    }
  },

  getPatient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const patient = await patientService.getPatientById(id);
      set({ selectedPatient: patient, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch patient', isLoading: false });
    }
  },

  createPatient: async (patient: Omit<Patient, '_id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newPatient = await patientService.createPatient(patient);
      set((state) => ({ patients: [...state.patients, newPatient], isLoading: false }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create patient', isLoading: false });
    }
  },

  updatePatient: async (id: string, patient: Partial<Patient>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPatient = await patientService.updatePatient(id, patient);
      set((state) => ({
        patients: state.patients.map((p) => (p._id === id ? updatedPatient : p)),
        selectedPatient: state.selectedPatient?._id === id ? updatedPatient : state.selectedPatient,
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update patient', isLoading: false });
    }
  },

  deletePatient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await patientService.deletePatient(id);
      set((state) => ({
        patients: state.patients.filter((p) => p._id !== id),
        selectedPatient: state.selectedPatient?._id === id ? null : state.selectedPatient,
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete patient', isLoading: false });
    }
  }
})); 