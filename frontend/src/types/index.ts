export interface User {
  id: string;
  email: string;
  role: 'admin' | 'dentist' | 'receptionist';
  name: string;
}

export interface Patient {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  medicalHistory?: string;
  dentalHistory?: {
    procedure: string;
    date: string;
    notes: string;
  }[];
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes?: string;
  allergies?: string[];
  createdAt?: string;
}

export type AppointmentType = 'checkup' | 'cleaning' | 'filling' | 'root canal' | 'extraction' | 'crown' | 'other';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  _id: string;
  patient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  treatmentPlan?: string;
  createdAt?: string;
}

export interface Treatment {
  _id: string;
  patient: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  type: string;
  description: string;
  cost: number;
  date: string;
  status: 'planned' | 'in-progress' | 'completed';
  notes?: string;
  createdAt: string;
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

export interface FinancialRecord {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Financial {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export interface Settings {
  id: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  clinicLogo: string;
  clinicHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  paymentMethods: string[];
  insuranceProviders: string[];
  appointmentReminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dataBackup: {
    frequency: 'daily' | 'weekly' | 'monthly';
    lastBackupDate: string;
  };
  userManagement: {
    roles: {
      admin: boolean;
      dentist: boolean;
      receptionist: boolean;
      nurse: boolean;
    };
    permissions: Record<string, boolean>;
  };
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'dentist' | 'nurse' | 'receptionist';
  salary: number;
  paymentStatus: 'paid' | 'due';
  lastPaymentDate?: string;
  createdAt?: string;
}

export interface SalaryPayment {
  _id: string;
  employeeId: string;
  amount: number;
  type: 'monthly' | 'advance' | 'bonus';
  paymentDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}