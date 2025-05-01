import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';
import type { Financial } from '../types';
import { financialService } from '../lib/financialService';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function RevenueReports() {
  const [financials, setFinancials] = useState<Financial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const financialsData = await financialService.getAllFinancials();
      setFinancials(financialsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load financial data');
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total revenue and expenses
  const totalRevenue = financials
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);
  
  const totalExpenses = financials
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const netIncome = totalRevenue - totalExpenses;

  // Calculate monthly trends
  const monthlyData = financials.reduce((acc, financial) => {
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
  }, {} as Record<string, { income: number; expenses: number }>);

  // Calculate category distribution
  const categoryData = financials.reduce((acc, financial) => {
    if (financial.type === 'expense') {
      acc[financial.category] = (acc[financial.category] || 0) + financial.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Prepare line chart data
  const lineChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map(d => d.income),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyData).map(d => d.expenses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Prepare pie chart data
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
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
        ticks: {
          callback: function(value: number | string) {
            return `DA ${Number(value).toLocaleString()}`;
          }
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
      <h1 className="text-2xl font-semibold mb-6">Revenue Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
            Financial Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold text-green-600">
                DA {totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-red-600">
                DA {totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Net Income</span>
              <span className={`font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                DA {netIncome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Trends Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Monthly Trends
          </h2>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Expense Categories Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-500" />
            Expense Categories
          </h2>
          <div className="h-64">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Growth Trends Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Revenue Growth
          </h2>
          <div className="space-y-4">
            {Object.entries(monthlyData).map(([month, data]) => (
              <div key={month} className="flex justify-between items-center">
                <span className="text-gray-600">{month}</span>
                <div className="flex gap-4">
                  <span className="text-green-600">+DA {data.income.toLocaleString()}</span>
                  <span className="text-red-600">-DA {data.expenses.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueReports; 