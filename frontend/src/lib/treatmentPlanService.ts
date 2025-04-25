import api from './api';

export interface Treatment {
  _id?: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
}

export interface TreatmentPlan {
  _id?: string;
  patientId: string;
  treatments: {
    treatmentId: string;
    status: 'pending' | 'in-progress' | 'completed';
    notes?: string;
  }[];
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  totalCost: number;
  notes?: string;
}

export const treatmentPlanService = {
  async getAllTreatmentPlans() {
    const response = await api.get('/treatment-plans');
    return response.data;
  },

  async getTreatmentPlanById(id: string) {
    const response = await api.get(`/treatment-plans/${id}`);
    return response.data;
  },

  async createTreatmentPlan(treatmentPlanData: TreatmentPlan) {
    const response = await api.post('/treatment-plans', treatmentPlanData);
    return response.data;
  },

  async updateTreatmentPlan(id: string, treatmentPlanData: Partial<TreatmentPlan>) {
    const response = await api.put(`/treatment-plans/${id}`, treatmentPlanData);
    return response.data;
  },

  async deleteTreatmentPlan(id: string) {
    const response = await api.delete(`/treatment-plans/${id}`);
    return response.data;
  },

  async getTreatmentPlansByPatient(patientId: string) {
    const response = await api.get(`/treatment-plans/patient/${patientId}`);
    return response.data;
  },

  async updateTreatmentStatus(planId: string, treatmentId: string, status: string) {
    const response = await api.put(`/treatment-plans/${planId}/treatments/${treatmentId}/status`, { status });
    return response.data;
  }
}; 