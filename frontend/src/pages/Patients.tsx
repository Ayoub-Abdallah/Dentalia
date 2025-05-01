import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, Calendar } from 'lucide-react';
import type { Patient, Appointment } from '../types';
import { usePatientStore } from '../store/patientStore';
import { appointmentService } from '../lib/appointmentService';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { PatientsTable } from '../components/PatientsTable';

type Gender = 'male' | 'female' | 'other';
type AppointmentType = 'checkup' | 'cleaning' | 'filling' | 'root canal' | 'extraction' | 'other';
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

interface FormData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  medicalHistory: string;
  allergies: string;
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes: string;
}

interface AppointmentFormData {
  patient: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  age: 0,
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'male',
  address: '',
  medicalHistory: '',
  allergies: '',
  insurance: {
    provider: '',
    policyNumber: '',
    groupNumber: ''
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  notes: ''
};

const initialAppointmentFormData: AppointmentFormData = {
  patient: '',
  date: '',
  startTime: '',
  endTime: '',
  type: 'checkup',
  status: 'scheduled',
  notes: ''
};

export default function Patients() {
  const { t } = useTranslation();
  const { patients, isLoading, error, fetchPatients, createPatient, updatePatient, deletePatient } = usePatientStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [appointmentFormData, setAppointmentFormData] = useState<AppointmentFormData>(initialAppointmentFormData);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    
    const query = searchQuery.toLowerCase();
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  }, [patients, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patientData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address || undefined,
        medicalHistory: formData.medicalHistory || undefined,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : undefined,
        insurance: formData.insurance.provider ? formData.insurance : undefined,
        emergencyContact: formData.emergencyContact.name ? formData.emergencyContact : undefined,
        notes: formData.notes || undefined
      };

      if (selectedPatient?._id) {
        await updatePatient(selectedPatient._id, patientData);
        toast.success('Patient updated successfully');
      } else {
        await createPatient(patientData);
        toast.success('Patient created successfully');
      }

      setShowAddModal(false);
      setSelectedPatient(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error('Failed to save patient');
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedPatient?._id) {
        toast.error('No patient selected');
        return;
      }

      const appointmentData = {
        ...appointmentFormData,
        patient: selectedPatient._id
      };

      await appointmentService.createAppointment(appointmentData);
      toast.success('Appointment created successfully');
      setShowAppointmentModal(false);
      setAppointmentFormData(initialAppointmentFormData);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address || '',
      medicalHistory: patient.medicalHistory || '',
      allergies: patient.allergies?.join(', ') || '',
      insurance: patient.insurance || {
        provider: '',
        policyNumber: '',
        groupNumber: ''
      },
      emergencyContact: patient.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      },
      notes: patient.notes || ''
    });
    setShowAddModal(true);
  };

  const handleCreateAppointment = (patient: Patient) => {
    setSelectedPatient(patient);
    setAppointmentFormData({
      ...initialAppointmentFormData,
      patient: patient._id || ''
    });
    setShowAppointmentModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Invalid patient ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        toast.success('Patient deleted successfully');
      } catch (error: any) {
        console.error('Delete error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete patient';
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('patients.title')}</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('patients.addPatient')}
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('patients.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <PatientsTable
          patients={filteredPatients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateAppointment={handleCreateAppointment}
        />
      </div>

      {/* Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {selectedPatient ? t('patients.editPatient') : t('patients.addNewPatient')}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPatient(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.firstName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.lastName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.age')}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.email')}
                  </label>
                  <input
                    type="email"
                    
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.phone')}
                  </label>
                  <input
                    type="tel"
                    
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.dateOfBirth')}
                  </label>
                  <input
                    type="date"
                    
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.gender')}
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">{t('patients.male')}</option>
                    <option value="female">{t('patients.female')}</option>
                    <option value="other">{t('patients.other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.address')}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.medicalHistory')}
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.allergies')}
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.insurance.provider')}
                  </label>
                  <input
                    type="text"
                    value={formData.insurance.provider}
                    onChange={(e) => setFormData({ ...formData, insurance: { ...formData.insurance, provider: e.target.value } })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.insurance.policyNumber')}
                  </label>
                  <input
                    type="text"
                    value={formData.insurance.policyNumber}
                    onChange={(e) => setFormData({ ...formData, insurance: { ...formData.insurance, policyNumber: e.target.value } })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.insurance.groupNumber')}
                  </label>
                  <input
                    type="text"
                    value={formData.insurance.groupNumber}
                    onChange={(e) => setFormData({ ...formData, insurance: { ...formData.insurance, groupNumber: e.target.value } })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.emergencyContact.name')}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.emergencyContact.relationship')}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.emergencyContact.phone')}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('patients.notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedPatient(null);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  {t('patients.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedPatient ? t('patients.updatePatient') : t('patients.addPatient')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {t('appointments.createAppointmentFor')} {selectedPatient.firstName} {selectedPatient.lastName}
              </h2>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setSelectedPatient(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAppointmentSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('appointments.date')}
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentFormData.date}
                    onChange={(e) => setAppointmentFormData({ ...appointmentFormData, date: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('appointments.startTime')}
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentFormData.startTime}
                    onChange={(e) => setAppointmentFormData({ ...appointmentFormData, startTime: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('appointments.endTime')}
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentFormData.endTime}
                    onChange={(e) => setAppointmentFormData({ ...appointmentFormData, endTime: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('appointments.type')}
                  </label>
                  <select
                    required
                    value={appointmentFormData.type}
                    onChange={(e) => setAppointmentFormData({ ...appointmentFormData, type: e.target.value as AppointmentType })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checkup">{t('appointments.checkup')}</option>
                    <option value="cleaning">{t('appointments.cleaning')}</option>
                    <option value="filling">{t('appointments.filling')}</option>
                    <option value="root canal">{t('appointments.rootCanal')}</option>
                    <option value="extraction">{t('appointments.extraction')}</option>
                    <option value="other">{t('appointments.other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('appointments.status')}
                  </label>
                  <select
                    required
                    value={appointmentFormData.status}
                    onChange={(e) => setAppointmentFormData({ ...appointmentFormData, status: e.target.value as AppointmentStatus })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">{t('appointments.scheduled')}</option>
                    <option value="completed">{t('appointments.completed')}</option>
                    <option value="cancelled">{t('appointments.cancelled')}</option>
                    <option value="no-show">{t('appointments.noShow')}</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('appointments.notes')}
                  </label>
                  <textarea
                    value={appointmentFormData.notes}
                    onChange={(e) => setAppointmentFormData({ ...appointmentFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setSelectedPatient(null);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  {t('patients.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('appointments.createAppointment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}