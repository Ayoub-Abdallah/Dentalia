import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, BarChart2 } from 'lucide-react';
import type { Patient } from '../types';

function PatientStatistics() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedPatients = localStorage.getItem('patients');
    const savedAppointments = localStorage.getItem('appointments');
    
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

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
          <div className="h-64 flex items-center justify-center text-gray-500">
            Growth Chart Placeholder
          </div>
        </div>

        {/* Treatment Distribution Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Distribution
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Treatment Distribution Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientStatistics; 