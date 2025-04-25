import api from './api';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id?: string;
  patientId: string;
  appointmentId?: string;
  treatmentPlanId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  dueDate: string;
  notes?: string;
}

export const invoiceService = {
  async getAllInvoices() {
    const response = await api.get('/invoices');
    return response.data;
  },

  async getInvoiceById(id: string) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  async createInvoice(invoiceData: Invoice) {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  async updateInvoice(id: string, invoiceData: Partial<Invoice>) {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  async deleteInvoice(id: string) {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  async getInvoicesByPatient(patientId: string) {
    const response = await api.get(`/invoices/patient/${patientId}`);
    return response.data;
  },

  async getInvoicesByStatus(status: string) {
    const response = await api.get(`/invoices/status/${status}`);
    return response.data;
  },

  async markInvoiceAsPaid(id: string, paymentData: { paymentMethod: string; paymentDate: string }) {
    const response = await api.put(`/invoices/${id}/pay`, paymentData);
    return response.data;
  },

  async generateInvoiceFromTreatmentPlan(treatmentPlanId: string) {
    const response = await api.post(`/invoices/generate/${treatmentPlanId}`);
    return response.data;
  }
}; 