import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { Appointment } from '../types';

function AppointmentAnalytics() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

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
  const totalDuration = appointments.reduce((sum, appointment) => sum + appointment.duration, 0);
  const averageDuration = totalAppointments > 0 ? totalDuration / totalAppointments : 0;

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
          <div className="h-64 flex items-center justify-center text-gray-500">
            Growth Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentAnalytics; 