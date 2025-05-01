import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { appointmentTypeService, AppointmentType } from '../lib/appointmentTypeService';

interface AppointmentTypeManagerProps {
  onTypeSelect?: (type: AppointmentType) => void;
  showAddButton?: boolean;
  onTypesUpdated?: () => void;
}

export function AppointmentTypeManager({ onTypeSelect, showAddButton = true, onTypesUpdated }: AppointmentTypeManagerProps) {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    color: '#3B82F6'
  });

  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedType) {
        await appointmentTypeService.updateAppointmentType(selectedType._id, formData);
        toast.success('Appointment type updated successfully');
      } else {
        const newType = await appointmentTypeService.createAppointmentType(formData);
        toast.success('Appointment type created successfully');
        if (onTypeSelect) {
          onTypeSelect(newType);
        }
      }
      setShowModal(false);
      setSelectedType(null);
      setFormData({
        name: '',
        description: '',
        duration: 30,
        color: '#3B82F6'
      });
      await fetchAppointmentTypes();
      if (onTypesUpdated) {
        onTypesUpdated();
      }
    } catch (error) {
      console.error('Error saving appointment type:', error);
      toast.error('Failed to save appointment type');
    }
  };

  const handleEdit = (type: AppointmentType) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      duration: type.duration,
      color: type.color
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment type?')) {
      return;
    }

    try {
      await appointmentTypeService.deleteAppointmentType(id);
      toast.success('Appointment type deleted successfully');
      fetchAppointmentTypes();
    } catch (error) {
      console.error('Error deleting appointment type:', error);
      toast.error('Failed to delete appointment type');
    }
  };

  return (
    <div>
      {showAddButton && (
        <button
          onClick={() => {
            setSelectedType(null);
            setFormData({
              name: '',
              description: '',
              duration: 30,
              color: '#3B82F6'
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Appointment Type
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointmentTypes.map((type) => (
          <div
            key={type._id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
            style={{ borderLeftColor: type.color, borderLeftWidth: '4px' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{type.name}</h3>
                {type.description && (
                  <p className="text-gray-600 text-sm mt-1">{type.description}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Duration: {type.duration} minutes
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(type._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {onTypeSelect && (
              <button
                onClick={() => onTypeSelect(type)}
                className="mt-3 w-full bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 text-sm"
              >
                Select
              </button>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">
                {selectedType ? 'Edit Appointment Type' : 'Add Appointment Type'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 p-1 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {selectedType ? 'Update' : 'Add'} Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 