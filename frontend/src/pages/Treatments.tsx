import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, DollarSign } from 'lucide-react';
import { Treatment, Patient } from '../types';
import { toast } from 'react-hot-toast';
import { patientService } from '../lib/patientService';
import { treatmentService } from '../lib/treatmentService';

function Treatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [formData, setFormData] = useState({
    patient: '',
    type: '',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'planned' as 'planned' | 'in-progress' | 'completed',
    notes: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTreatmentForPayment, setSelectedTreatmentForPayment] = useState<Treatment | null>(null);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'cash' as 'cash' | 'credit_card' | 'insurance' | 'bank_transfer',
    notes: ''
  });

  useEffect(() => {
    fetchTreatments();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to access this feature');
        return;
      }

      const response = await fetch('http://localhost:5001/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Patients data:', data); // Debug log
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/treatments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched treatments:', data); // Debug log
      setTreatments(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      setError('Failed to fetch treatments');
      setTreatments([]);
      setLoading(false);
    }
  };

  const filteredTreatments = treatments.filter((treatment) =>
    treatment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = selectedTreatment
        ? `http://localhost:5001/api/treatments/${selectedTreatment._id}`
        : 'http://localhost:5001/api/treatments';
      
      const method = selectedTreatment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save treatment');
      }

      await fetchTreatments();
      setShowModal(false);
      setSelectedTreatment(null);
      setFormData({
        patient: '',
        type: '',
        description: '',
        cost: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'planned',
        notes: '',
      });
      toast.success(selectedTreatment ? 'Treatment updated successfully' : 'Treatment created successfully');
    } catch (error) {
      console.error('Error saving treatment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save treatment');
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setFormData({
      patient: typeof treatment.patient === 'string' ? treatment.patient : treatment.patient._id,
      type: treatment.type,
      description: treatment.description,
      cost: treatment.cost,
      date: treatment.date || new Date().toISOString().split('T')[0],
      status: treatment.status,
      notes: treatment.notes || '',
    });
    setSelectedTreatment(treatment);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this treatment?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/treatments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete treatment');
      }

      // Remove the deleted treatment from the state
      setTreatments(treatments.filter(treatment => treatment._id !== id));
      toast.success('Treatment deleted successfully');
    } catch (error) {
      console.error('Error deleting treatment:', error);
      toast.error('Failed to delete treatment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTreatmentForPayment?._id) {
      toast.error('Invalid treatment selected');
      return;
    }

    try {
      const updatedTreatment = await treatmentService.addPayment(
        selectedTreatmentForPayment._id,
        paymentData
      );
      
      // Update the treatments list with the updated treatment
      setTreatments(treatments.map(treatment => 
        treatment._id === updatedTreatment._id ? updatedTreatment : treatment
      ));
      
      setShowPaymentModal(false);
      setSelectedTreatmentForPayment(null);
      setPaymentData({
        amount: 0,
        method: 'cash',
        notes: ''
      });
      toast.success('Payment added successfully');
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add payment');
    }
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
        <h1 className="text-2xl font-semibold">Treatments</h1>
        <button
          onClick={() => {
            setSelectedTreatment(null);
            setFormData({
              patient: '',
              type: '',
              description: '',
              cost: 0,
              date: new Date().toISOString().split('T')[0],
              status: 'planned',
              notes: '',
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Treatment
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {treatments.map((treatment) => (
              <tr key={treatment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {typeof treatment.patient === 'string' 
                    ? patients.find(p => p._id === treatment.patient)?.firstName
                    : `${treatment.patient.firstName} ${treatment.patient.lastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{treatment.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">DA {(treatment.cost || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">DA {(treatment.paidAmount || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">DA {((treatment.cost || 0) - (treatment.paidAmount || 0)).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${treatment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      treatment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {treatment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedTreatmentForPayment(treatment);
                      const remainingBalance = Number(treatment.cost || 0) - Number(treatment.paidAmount || 0);
                      setPaymentData({
                        amount: remainingBalance > 0 ? remainingBalance : 0,
                        method: 'cash',
                        notes: ''
                      });
                      setShowPaymentModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    disabled={(treatment.paidAmount || 0) >= (treatment.cost || 0)}
                  >
                    <DollarSign className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleEdit(treatment)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(treatment._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {selectedTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTreatment(null);
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
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
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
                    Cost
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'planned' | 'in-progress' | 'completed' })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="md:col-span-2">
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {selectedTreatment ? 'Update' : 'Add'} Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && selectedTreatmentForPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Payment Form */}
              <div>
                <form onSubmit={handleAddPayment}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={paymentData.amount || 0}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setPaymentData({ ...paymentData, amount: value });
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max={Number(selectedTreatmentForPayment?.cost || 0) - Number(selectedTreatmentForPayment?.paidAmount || 0)}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentData.method}
                      onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as 'cash' | 'credit_card' | 'insurance' | 'bank_transfer' })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="insurance">Insurance</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Add Payment
                    </button>
                  </div>
                </form>
              </div>

              {/* Payment History */}
              <div className="border-l pl-6">
                <h4 className="text-lg font-medium mb-4">Payment History</h4>
                <div className="space-y-4">
                  {selectedTreatmentForPayment.paymentHistory && selectedTreatmentForPayment.paymentHistory.length > 0 ? (
                    selectedTreatmentForPayment.paymentHistory
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((payment, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">DA {payment.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.date).toLocaleDateString()} at{' '}
                                {new Date(payment.date).toLocaleTimeString()}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">
                                {payment.method.replace('_', ' ')}
                              </p>
                            </div>
                            {payment.notes && (
                              <p className="text-sm text-gray-600 italic">{payment.notes}</p>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 italic">No payment history available</p>
                  )}
                </div>
                
                {/* Payment Summary */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-medium">DA {selectedTreatmentForPayment.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium">DA {selectedTreatmentForPayment.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Remaining Balance:</span>
                    <span className={selectedTreatmentForPayment.remainingBalance === 0 ? 'text-green-600' : 'text-red-600'}>
                      DA {(selectedTreatmentForPayment.cost - selectedTreatmentForPayment.paidAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Treatments;

