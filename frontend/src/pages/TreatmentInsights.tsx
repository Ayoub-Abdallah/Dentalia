import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';
import type { Treatment } from '../types';

function TreatmentInsights() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    // Load treatments from localStorage
    const savedTreatments = localStorage.getItem('treatments');
    if (savedTreatments) {
      setTreatments(JSON.parse(savedTreatments));
    }
  }, []);

  // Calculate treatment popularity
  const treatmentPopularity = treatments.reduce((acc, treatment) => {
    acc[treatment.type] = (acc[treatment.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort treatments by popularity
  const sortedTreatments = Object.entries(treatmentPopularity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5 most popular treatments

  // Calculate success rates
  const successRates = treatments.reduce((acc, treatment) => {
    if (!acc[treatment.type]) {
      acc[treatment.type] = {
        total: 0,
        successful: 0
      };
    }
    acc[treatment.type].total++;
    if (treatment.status === 'completed') {
      acc[treatment.type].successful++;
    }
    return acc;
  }, {} as Record<string, { total: number; successful: number }>);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Treatment Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Treatments Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Most Popular Treatments
          </h2>
          <div className="space-y-4">
            {sortedTreatments.map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">{type}</span>
                </div>
                <span className="font-semibold">{count} procedures</span>
              </div>
            ))}
          </div>
        </div>

        {/* Success Rates Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Success Rates
          </h2>
          <div className="space-y-4">
            {Object.entries(successRates).map(([type, stats]) => {
              const successRate = (stats.successful / stats.total) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{type}</span>
                    <span className="font-semibold">{successRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Treatment Trends Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Trends
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Treatment Trends Chart Placeholder
          </div>
        </div>

        {/* Treatment Outcomes Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
            Treatment Outcomes
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">Completed</span>
              </div>
              <span className="font-semibold">
                {treatments.filter(t => t.status === 'completed').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-gray-600">In Progress</span>
              </div>
              <span className="font-semibold">
                {treatments.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-gray-600">Planned</span>
              </div>
              <span className="font-semibold">
                {treatments.filter(t => t.status === 'planned').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreatmentInsights; 