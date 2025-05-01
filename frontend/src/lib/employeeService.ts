import api from './api';
import type { Employee, SalaryPayment } from '../types';

export const employeeService = {
  async getAllEmployees() {
    const response = await api.get('/employees');
    return response.data.data || [];
  },

  async getEmployeeById(id: string) {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  async createEmployee(employeeData: Omit<Employee, '_id'>) {
    const response = await api.post('/employees', employeeData);
    return response.data.data;
  },

  async updateEmployee(id: string, employeeData: Partial<Employee>) {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data.data;
  },

  async deleteEmployee(id: string) {
    const response = await api.delete(`/employees/${id}`);
    return response.data.data;
  },

  async searchEmployees(query: string) {
    const response = await api.get(`/employees/search?q=${query}`);
    return response.data.data;
  },

  // Salary payment methods
  async getAllSalaryPayments() {
    const response = await api.get('/employees/salary-payments');
    return response.data.data || [];
  },

  async getSalaryPaymentsByEmployee(employeeId: string) {
    const response = await api.get(`/employees/salary-payments/employee/${employeeId}`);
    return response.data.data || [];
  },

  async createSalaryPayment(paymentData: Omit<SalaryPayment, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/employees/salary-payments', paymentData);
    return response.data;
  },

  async updateSalaryPayment(id: string, paymentData: Partial<SalaryPayment>) {
    const response = await api.put(`/employees/salary-payments/${id}`, paymentData);
    return response.data.data;
  },

  async deleteSalaryPayment(id: string) {
    const response = await api.delete(`/employees/salary-payments/${id}`);
    return response.data.data;
  }
}; 