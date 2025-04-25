import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { patientService } from '../lib/patientService';
import { appointmentService } from '../lib/appointmentService';
import { financialService } from '../lib/financialService';
import { treatmentService } from '../lib/treatmentService';
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
import type { Patient, Appointment, Financial, Treatment } from '../types';

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

interface DashboardStats {
  patients: { total: number; newThisMonth: number };
  appointments: { total: number; today: number; upcoming: number; completed: number; cancelled: number };
  finances: { revenue: number; expenses: number; netIncome: number };
  treatments: { total: number; completed: number; inProgress: number };
}

interface MonthlyData {
  income: number;
  expenses: number;
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    patients: { total: 0, newThisMonth: 0 },
    appointments: { total: 0, today: 0, upcoming: 0, completed: 0, cancelled: 0 },
    finances: { revenue: 0, expenses: 0, netIncome: 0 },
    treatments: { total: 0, completed: 0, inProgress: 0 }
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Financial[]>([]);
  const [trendData, setTrendData] = useState({
    labels: [] as string[],
    datasets: [] as {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        patientsData,
        appointmentsData,
        financialsData,
        treatmentsData
      ] = await Promise.all([
        patientService.getAllPatients(),
        appointmentService.getAllAppointments(),
        financialService.getAllFinancials(),
        treatmentService.getAllTreatments()
      ]);

      // Process patients data
      const totalPatients = patientsData.length;
      const newPatientsThisMonth = patientsData.filter((patient: Patient) => {
        const createdAt = new Date(patient.createdAt || '');
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && 
               createdAt.getFullYear() === now.getFullYear();
      }).length;

      // Process appointments data
      const totalAppointments = appointmentsData.length;
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(app => app.date === today).length;
      const upcomingAppointments = appointmentsData.filter(app => 
        app.date > today && app.status !== 'cancelled'
      ).length;
      const completedAppointments = appointmentsData.filter(app => app.status === 'completed').length;
      const cancelledAppointments = appointmentsData.filter(app => app.status === 'cancelled').length;

      // Process financial data
      const totalRevenue = financialsData
        .filter((f: Financial) => f.type === 'income')
        .reduce((sum: number, f: Financial) => sum + f.amount, 0);
      
      const totalExpenses = financialsData
        .filter((f: Financial) => f.type === 'expense')
        .reduce((sum: number, f: Financial) => sum + f.amount, 0);

      const netIncome = totalRevenue - totalExpenses;

      // Process treatments data
      const totalTreatments = treatmentsData.length;
      const completedTreatments = treatmentsData.filter(t => t.status === 'completed').length;
      const inProgressTreatments = treatmentsData.filter(t => t.status === 'in-progress').length;

      // Set stats
      setStats({
        patients: { total: totalPatients, newThisMonth: newPatientsThisMonth },
        appointments: { 
          total: totalAppointments, 
          today: todayAppointments, 
          upcoming: upcomingAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments
        },
        finances: { revenue: totalRevenue, expenses: totalExpenses, netIncome },
        treatments: { total: totalTreatments, completed: completedTreatments, inProgress: inProgressTreatments }
      });

      // Set recent data
      setRecentPatients(patientsData.slice(-5).reverse());
      setUpcomingAppointments(
        appointmentsData
          .filter(app => app.date >= today && app.status !== 'cancelled')
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5)
      );
      setRecentTransactions(financialsData.slice(-5).reverse());

      // Prepare trend data
      const monthlyData = financialsData.reduce((acc: Record<string, MonthlyData>, financial: Financial) => {
        const month = new Date(financial.date).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { income: 0, expenses: 0 };
        }
        if (financial.type === 'income') {
          acc[month].income += financial.amount;
        } else {
          acc[month].expenses += financial.amount;
        }
        return acc;
      }, {} as Record<string, MonthlyData>);

      setTrendData({
        labels: Object.keys(monthlyData),
        datasets: [
          {
            label: 'Income',
            data: Object.values(monthlyData as Record<string, MonthlyData>).map(d => d.income),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            tension: 0.3,
          },
          {
            label: 'Expenses',
            data: Object.values(monthlyData as Record<string, MonthlyData>).map(d => d.expenses),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            tension: 0.3,
          },
        ],
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return `$${Number(value).toLocaleString()}`;
          }
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
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Patients Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Patients
            </h2>
            <Link to="/patients" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Patients</span>
              <span className="font-semibold">{stats.patients.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New This Month</span>
              <span className="font-semibold text-green-600">+{stats.patients.newThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Appointments
            </h2>
            <Link to="/appointments" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Appointments</span>
              <span className="font-semibold">{stats.appointments.today}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upcoming</span>
              <span className="font-semibold">{stats.appointments.upcoming}</span>
            </div>
          </div>
        </div>

        {/* Finances Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
              Finances
            </h2>
            <Link to="/finances" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Net Income</span>
              <span className={`font-semibold ${stats.finances.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.finances.netIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-semibold text-green-600">
                ${stats.finances.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Treatments Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Treatments
            </h2>
            <Link to="/treatments" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Treatments</span>
              <span className="font-semibold">{stats.treatments.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-yellow-600">{stats.treatments.inProgress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Financial Trends */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Financial Trends
          </h2>
          <div className="h-64">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Upcoming Appointments
            </h2>
            <Link to="/appointments" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {appointment.patient.firstName} {appointment.patient.lastName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{appointment.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Recent Patients
            </h2>
            <Link to="/patients" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient) => (
                <div key={patient._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(patient.createdAt || new Date()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {patient.email} • {patient.phone}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent patients</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
              Recent Transactions
            </h2>
            <Link to="/finances" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{transaction.description}</span>
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{transaction.category}</span>
                    <span className="text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;