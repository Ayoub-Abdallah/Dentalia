import { create } from 'zustand';
import { invoiceService, Invoice } from '../lib/invoiceService';

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  getInvoice: (id: string) => Promise<void>;
  createInvoice: (invoice: Omit<Invoice, '_id'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoicesByPatient: (patientId: string) => Promise<void>;
  getInvoicesByStatus: (status: string) => Promise<void>;
  markInvoiceAsPaid: (id: string, paymentData: { paymentMethod: string; paymentDate: string }) => Promise<void>;
  generateInvoiceFromTreatmentPlan: (treatmentPlanId: string) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const invoices = await invoiceService.getAllInvoices();
      set({ invoices });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch invoices' });
    } finally {
      set({ isLoading: false });
    }
  },

  getInvoice: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const invoice = await invoiceService.getInvoiceById(id);
      set({ selectedInvoice: invoice });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch invoice' });
    } finally {
      set({ isLoading: false });
    }
  },

  createInvoice: async (invoice: Omit<Invoice, '_id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newInvoice = await invoiceService.createInvoice(invoice);
      set((state) => ({ invoices: [...state.invoices, newInvoice] }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create invoice' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateInvoice: async (id: string, invoice: Partial<Invoice>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedInvoice = await invoiceService.updateInvoice(id, invoice);
      set((state) => ({
        invoices: state.invoices.map((i) => (i._id === id ? updatedInvoice : i)),
        selectedInvoice: state.selectedInvoice?._id === id ? updatedInvoice : state.selectedInvoice,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update invoice' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInvoice: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await invoiceService.deleteInvoice(id);
      set((state) => ({
        invoices: state.invoices.filter((i) => i._id !== id),
        selectedInvoice: state.selectedInvoice?._id === id ? null : state.selectedInvoice,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete invoice' });
    } finally {
      set({ isLoading: false });
    }
  },

  getInvoicesByPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const invoices = await invoiceService.getInvoicesByPatient(patientId);
      set({ invoices });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch patient invoices' });
    } finally {
      set({ isLoading: false });
    }
  },

  getInvoicesByStatus: async (status: string) => {
    set({ isLoading: true, error: null });
    try {
      const invoices = await invoiceService.getInvoicesByStatus(status);
      set({ invoices });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch invoices by status' });
    } finally {
      set({ isLoading: false });
    }
  },

  markInvoiceAsPaid: async (id: string, paymentData: { paymentMethod: string; paymentDate: string }) => {
    set({ isLoading: true, error: null });
    try {
      const updatedInvoice = await invoiceService.markInvoiceAsPaid(id, paymentData);
      set((state) => ({
        invoices: state.invoices.map((i) => (i._id === id ? updatedInvoice : i)),
        selectedInvoice: state.selectedInvoice?._id === id ? updatedInvoice : state.selectedInvoice,
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to mark invoice as paid' });
    } finally {
      set({ isLoading: false });
    }
  },

  generateInvoiceFromTreatmentPlan: async (treatmentPlanId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newInvoice = await invoiceService.generateInvoiceFromTreatmentPlan(treatmentPlanId);
      set((state) => ({ invoices: [...state.invoices, newInvoice] }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to generate invoice' });
    } finally {
      set({ isLoading: false });
    }
  },
})); 