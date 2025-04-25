import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { Appointment } from '../types';
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

function AppointmentAnalytics() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appointmentsData = await appointmentService.getAllAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load appointment data');
      toast.error('Failed to load appointment data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion rates
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

  // Calculate scheduling trends
  const monthlyAppointments = appointments.reduce((acc, appointment) => {
    const month = new Date(appointment.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate average appointment duration
  const totalDuration = appointments.reduce((sum, appointment) => {
    const start = new Date(`2000-01-01T${appointment.startTime}`);
    const end = new Date(`2000-01-01T${appointment.endTime}`);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
  }, 0);
  const averageDuration = totalAppointments > 0 ? totalDuration / totalAppointments : 0;

  // Calculate appointment growth data
  const appointmentGrowthData = appointments.reduce((acc, appointment) => {
    const month = new Date(appointment.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const chartData = {
    labels: Object.keys(appointmentGrowthData),
    datasets: [
      {
        label: 'Appointments',
        data: Object.values(appointmentGrowthData),
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
      <h1 className="text-2xl font-semibold mb-6">Appointment Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Rates Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
            Completion Rates
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Appointments</span>
              <span className="font-semibold">{totalAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold">{completedAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cancelled</span>
              <span className="font-semibold">{cancelledAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">{completionRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Scheduling Trends Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Monthly Scheduling Trends
          </h2>
          <div className="space-y-4">
            {Object.entries(monthlyAppointments).map(([month, count]) => (
              <div key={month} className="flex justify-between items-center">
                <span className="text-gray-600">{month}</span>
                <span className="font-semibold">{count} appointments</span>
              </div>
            ))}
          </div>
        </div>

        {/* Average Duration Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Average Appointment Duration
          </h2>
          <div className="text-center py-4">
            <span className="text-3xl font-bold">{averageDuration.toFixed(1)}</span>
            <span className="text-gray-600 ml-2">minutes</span>
          </div>
        </div>

        {/* Growth Trends Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Appointment Growth
          </h2>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentAnalytics; 