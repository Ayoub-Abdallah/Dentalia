import { create } from 'zustand';
import { treatmentPlanService, TreatmentPlan } from '../lib/treatmentPlanService';

interface TreatmentPlanState {
  treatmentPlans: TreatmentPlan[];
  selectedPlan: TreatmentPlan | null;
  isLoading: boolean;
  error: string | null;
  fetchTreatmentPlans: () => Promise<void>;
  getTreatmentPlan: (id: string) => Promise<void>;
  createTreatmentPlan: (plan: Omit<TreatmentPlan, '_id'>) => Promise<void>;
  updateTreatmentPlan: (id: string, plan: Partial<TreatmentPlan>) => Promise<void>;
  deleteTreatmentPlan: (id: string) => Promise<void>;
  getPlansByPatient: (patientId: string) => Promise<void>;
  getPlansByDentist: (dentistId: string) => Promise<void>;
  updateTreatmentStatus: (planId: string, treatmentId: string, status: string) => Promise<void>;
}

export const useTreatmentPlanStore = create<TreatmentPlanState>((set) => ({
  treatmentPlans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,

  fetchTreatmentPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const plans = await treatmentPlanService.getAllTreatmentPlans();
      set({ treatmentPlans: plans });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch treatment plans' });
    } finally {
      set({ isLoading: false });
    }
  },

  getTreatmentPlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const plan = await treatmentPlanService.getTreatmentPlanById(id);
      set({ selectedPlan: plan });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch treatment plan' });
    } finally {
      set({ isLoading: false });
    }
  },

  createTreatmentPlan: async (plan: Omit<TreatmentPlan, '_id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newPlan = await treatmentPlanService.createTreatmentPlan(plan);
      set((state) => ({ treatmentPlans: [...state.treatmentPlans, newPlan] }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create treatment plan' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTreatmentPlan: async (id: string, plan: Partial<TreatmentPlan>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlan = await treatmentPlanService.updateTreatmentPlan(id, plan);
      set((state) => ({
        treatmentPlans: state.treatmentPlans.map((p) => (p._id === id ? updatedPlan : p)),
        selectedPlan: state.selectedPlan?._id === id ? updatedPlan : state.selectedPlan,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update treatment plan' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTreatmentPlan: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await treatmentPlanService.deleteTreatmentPlan(id);
      set((state) => ({
        treatmentPlans: state.treatmentPlans.filter((p) => p._id !== id),
        selectedPlan: state.selectedPlan?._id === id ? null : state.selectedPlan,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete treatment plan' });
    } finally {
      set({ isLoading: false });
    }
  },

  getPlansByPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const plans = await treatmentPlanService.getTreatmentPlansByPatient(patientId);
      set({ treatmentPlans: plans });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch patient treatment plans' });
    } finally {
      set({ isLoading: false });
    }
  },

  getPlansByDentist: async (dentistId: string) => {
    set({ isLoading: true, error: null });
    try {
      const plans = await treatmentPlanService.getTreatmentPlansByDentist(dentistId);
      set({ treatmentPlans: plans });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch dentist treatment plans' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTreatmentStatus: async (planId: string, treatmentId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      await treatmentPlanService.updateTreatmentStatus(planId, treatmentId, status);
      set((state) => ({
        treatmentPlans: state.treatmentPlans.map((plan) => {
          if (plan._id === planId) {
            return {
              ...plan,
              treatments: plan.treatments.map((treatment) =>
                treatment.treatmentId === treatmentId ? { ...treatment, status } : treatment
              ),
            };
          }
          return plan;
        }),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update treatment status' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 