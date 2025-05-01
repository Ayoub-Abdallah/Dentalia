// src/components/Appointments.tsx
import React, { useState, useEffect } from 'react';
import { useAppointmentStore } from '../store/appointmentStore';
import { usePatientStore } from '../store/patientStore';
import { toast } from 'react-hot-toast';
import { Appointment, AppointmentType, AppointmentStatus } from '../types';
import { Plus, Search, Edit2, Trash2, X, Settings } from 'lucide-react';
import { appointmentService } from '../lib/appointmentService';
import { AppointmentTypeManager } from '../components/AppointmentTypeManager';
import { appointmentTypeService } from '../lib/appointmentTypeService';

interface AppointmentFormData {
  patient: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: AppointmentStatus;
}

interface AppointmentFormState extends AppointmentFormData {
  duration: number;
}

// Import the AppointmentApiData type from the service
type AppointmentApiData = Omit<AppointmentFormData, 'patient'> & {
  patient: string;
};

export default function Appointments() {
  const { 
    appointments, 
    loading, 
    error, 
    fetchAppointments, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment 
  } = useAppointmentStore();
  
  const { patients, fetchPatients } = usePatientStore();
  
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<AppointmentFormState>({
    patient: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    duration: 30,
    notes: '',
    status: 'scheduled'
  });
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchAppointmentTypes();
  }, []);

  const fetchAppointmentTypes = async () => {
    try {
      const types = await appointmentTypeService.getAllAppointmentTypes();
      setAppointmentTypes(types);
    } catch (error) {
      console.error('Error fetching appointment types:', error);
      toast.error('Failed to fetch appointment types');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase();
    const typeName = appointment.type?.name?.toLowerCase() || '';
    return patientName.includes(searchQuery.toLowerCase()) || 
           typeName.includes(searchQuery.toLowerCase()) ||
           appointment.status.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const appointmentData: AppointmentFormData = {
        patient: formData.patient,
        type: formData.type,
        date: formData.date,
        startTime: formData.startTime,
        endTime: calculateEndTime(formData.startTime, formData.duration),
        notes: formData.notes,
        status: formData.status
      };

      if (selectedAppointment?._id) {
        const updatedAppointment = await appointmentService.updateAppointment(selectedAppointment._id, appointmentData);
        updateAppointment(selectedAppointment._id, updatedAppointment);
        toast.success('Appointment updated successfully');
      } else {
        const newAppointment = await appointmentService.createAppointment(appointmentData);
        addAppointment(newAppointment);
        toast.success('Appointment created successfully');
      }
      setShowModal(false);
      setSelectedAppointment(null);
      setFormData({
        patient: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        duration: 30,
        notes: '',
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save appointment');
    }
  };

  const calculateEndTime = (startTime: string, duration: number): string => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes);
    startDate.setMinutes(startDate.getMinutes() + duration);
    return `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      patient: appointment.patient._id || '',
      type: appointment.type?._id || '',
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      duration: appointment.type?.duration || 30,
      notes: appointment.notes || '',
      status: appointment.status
    });
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error('Invalid appointment ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentService.deleteAppointment(id);
        deleteAppointment(id);
        toast.success('Appointment deleted successfully');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete appointment');
      }
    }
  };

  const handleTypeManagerClose = () => {
    setShowTypeManager(false);
    // Refresh appointment types when the type manager is closed
    fetchAppointmentTypes();
  };

  if (loading) {
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
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowTypeManager(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Types
          </button>
          <button
            onClick={() => {
              setSelectedAppointment(null);
              setFormData({
                patient: '',
                type: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '',
                endTime: '',
                duration: 30,
                notes: '',
                status: 'scheduled'
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Appointment
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {appointment.type?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      appointment.status === 'no-show' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {selectedAppointment ? 'Edit Appointment' : 'Add New Appointment'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointment(null);
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
                    Patient
                  </label>
                  <select
                    required
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="flex space-x-2">
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => {
                        const type = appointmentTypes.find(t => t._id === e.target.value);
                        setSelectedType(type || null);
                        setFormData({
                          ...formData,
                          type: e.target.value,
                          duration: type?.duration || 30
                        });
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a type</option>
                      {appointmentTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name} ({type.duration} min)
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowTypeManager(true)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    required
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AppointmentStatus })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {['scheduled', 'completed', 'cancelled', 'no-show'].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
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
                    setShowModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedAppointment ? 'Update Appointment' : 'Add Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTypeManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Manage Appointment Types</h2>
              <button
                onClick={handleTypeManagerClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <AppointmentTypeManager
                onTypeSelect={(type) => {
                  setSelectedType(type);
                  setFormData({
                    ...formData,
                    type: type._id,
                    duration: type.duration
                  });
                  setShowTypeManager(false);
                }}
                onTypesUpdated={fetchAppointmentTypes}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
