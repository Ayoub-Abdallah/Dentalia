import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, PieChart, BarChart } from 'lucide-react';
import type { FinancialRecord } from '../types';

function RevenueReports() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    // Load financial records from localStorage
    const savedRecords = localStorage.getItem('financialRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Calculate total revenue
  const totalRevenue = records
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.amount, 0);

  // Calculate total expenses
  const totalExpenses = records
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.amount, 0);

  // Calculate net income
  const netIncome = totalRevenue - totalExpenses;

  // Calculate revenue by category
  const revenueByCategory = records
    .filter(record => record.type === 'income')
    .reduce((acc, record) => {
      acc[record.category] = (acc[record.category] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  // Calculate monthly revenue
  const monthlyRevenue = records
    .filter(record => record.type === 'income')
    .reduce((acc, record) => {
      const month = new Date(record.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + record.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Revenue Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Overview Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
            Financial Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold">${totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Net Income</span>
              <span className={`font-semibold ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${netIncome.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue by Category Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-500" />
            Revenue by Category
          </h2>
          <div className="space-y-4">
            {Object.entries(revenueByCategory).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-600">{category}</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-blue-500" />
            Monthly Revenue
          </h2>
          <div className="space-y-4">
            {Object.entries(monthlyRevenue).map(([month, amount]) => (
              <div key={month} className="flex justify-between items-center">
                <span className="text-gray-600">{month}</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Growth Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Revenue Growth
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Growth Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueReports; 