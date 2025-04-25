import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, BarChart2 } from 'lucide-react';
import type { Patient, Appointment } from '../types';
import { patientService } from '../lib/patientService';
import { appointmentService } from '../lib/appointmentService';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PatientStatistics() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsData, appointmentsData] = await Promise.all([
        patientService.getAllPatients(),
        appointmentService.getAllAppointments()
      ]);
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load statistics data');
      toast.error('Failed to load statistics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate demographics
  const totalPatients = patients.length;
  const ageGroups = patients.reduce((acc, patient) => {
    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
    if (age < 18) acc.children++;
    else if (age < 30) acc.youngAdults++;
    else if (age < 50) acc.adults++;
    else acc.seniors++;
    return acc;
  }, { children: 0, youngAdults: 0, adults: 0, seniors: 0 });

  // Calculate visit patterns
  const monthlyVisits = appointments.reduce((acc, appointment) => {
    const month = new Date(appointment.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate treatment distribution
  const treatmentDistribution = appointments.reduce((acc, appointment) => {
    acc[appointment.type] = (acc[appointment.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate patient growth data
  const patientGrowthData = patients.reduce((acc, patient) => {
    const month = new Date(patient.createdAt || new Date()).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const chartData = {
    labels: Object.keys(patientGrowthData),
    datasets: [
      {
        label: 'New Patients',
        data: Object.values(patientGrowthData),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
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
      <h1 className="text-2xl font-semibold mb-6">Patient Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Patient Demographics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Patients</span>
              <span className="font-semibold">{totalPatients}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Children (0-17)</span>
              <span className="font-semibold">{ageGroups.children}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Young Adults (18-29)</span>
              <span className="font-semibold">{ageGroups.youngAdults}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Adults (30-49)</span>
              <span className="font-semibold">{ageGroups.adults}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Seniors (50+)</span>
              <span className="font-semibold">{ageGroups.seniors}</span>
            </div>
          </div>
        </div>

        {/* Visit Patterns Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Monthly Visit Patterns
          </h2>
          <div className="space-y-4">
            {Object.entries(monthlyVisits).map(([month, count]) => (
              <div key={month} className="flex justify-between items-center">
                <span className="text-gray-600">{month}</span>
                <span className="font-semibold">{count} visits</span>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Growth Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Patient Growth
          </h2>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Treatment Distribution Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Distribution
          </h2>
          <div className="space-y-4">
            {Object.entries(treatmentDistribution).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600">{type}</span>
                <span className="font-semibold">{count} appointments</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientStatistics; 