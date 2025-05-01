export interface User {
  id: string;
  email: string;
  role: 'admin' | 'dentist' | 'staff';
  name: string;
}

export interface Patient {
  _id?: string;
  firstName: string;
  lastName: string;
  age?: number;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string[];
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  notes?: string;
  treatments?: Treatment[];
  createdAt?: string;
  updatedAt?: string;
}

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

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  _id: string;
  patient: Patient;
  type: AppointmentType;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  _id?: string;
  type: string;
  date: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
  patient: string;
  cost?: number;
  paymentStatus?: 'pending' | 'partial' | 'paid';
  nextAppointment?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
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