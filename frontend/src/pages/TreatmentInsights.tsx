import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, BarChart } from 'lucide-react';
import type { Treatment } from '../types';
import { treatmentService } from '../lib/treatmentService';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TreatmentInsights() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const treatmentsData = await treatmentService.getAllTreatments();
      setTreatments(treatmentsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load treatment data');
      toast.error('Failed to load treatment data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate treatment statistics
  const totalTreatments = treatments.length;
  const completedTreatments = treatments.filter(t => t.status === 'completed').length;
  const inProgressTreatments = treatments.filter(t => t.status === 'in-progress').length;
  const plannedTreatments = treatments.filter(t => t.status === 'planned').length;
  
  const completionRate = totalTreatments > 0 ? (completedTreatments / totalTreatments) * 100 : 0;

  // Calculate total revenue from treatments
  const totalRevenue = treatments.reduce((sum, treatment) => sum + treatment.cost, 0);

  // Calculate average treatment cost
  const averageCost = totalTreatments > 0 ? totalRevenue / totalTreatments : 0;

  // Calculate treatments by type
  const treatmentsByType = treatments.reduce((acc, treatment) => {
    acc[treatment.type] = (acc[treatment.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate revenue by treatment type
  const revenueByType = treatments.reduce((acc, treatment) => {
    acc[treatment.type] = (acc[treatment.type] || 0) + treatment.cost;
    return acc;
  }, {} as Record<string, number>);

  // Prepare bar chart data for treatment types
  const treatmentTypeData = {
    labels: Object.keys(treatmentsByType),
    datasets: [
      {
        label: 'Number of Treatments',
        data: Object.values(treatmentsByType),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare bar chart data for revenue by type
  const revenueByTypeData = {
    labels: Object.keys(revenueByType),
    datasets: [
      {
        label: 'Revenue ($)',
        data: Object.values(revenueByType),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
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
      },
    },
  };

  const revenueChartOptions = {
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
      <h1 className="text-2xl font-semibold mb-6">Treatment Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Treatment Status Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Status
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Treatments</span>
              <span className="font-semibold">{totalTreatments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">{completedTreatments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-yellow-600">{inProgressTreatments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Planned</span>
              <span className="font-semibold text-blue-600">{plannedTreatments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold">{completionRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Treatment Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Revenue
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Treatment Cost</span>
              <span className="font-semibold">
                ${averageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue per Completed Treatment</span>
              <span className="font-semibold">
                ${completedTreatments > 0 ? (totalRevenue / completedTreatments).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Treatment Types Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Types
          </h2>
          <div className="h-64">
            <Bar data={treatmentTypeData} options={chartOptions} />
          </div>
        </div>

        {/* Revenue by Treatment Type Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Revenue by Treatment Type
          </h2>
          <div className="h-64">
            <Bar data={revenueByTypeData} options={revenueChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreatmentInsights; 