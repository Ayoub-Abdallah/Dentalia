import React from 'react';
import { BarChart2, TrendingUp, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();

  const reports = [
    {
      title: 'Patient Statistics',
      icon: Users,
      description: 'View detailed patient demographics and visit patterns',
      path: '/reports/patient-statistics'
    },
    {
      title: 'Appointment Analytics',
      icon: Calendar,
      description: 'Track appointment completion rates and scheduling trends',
      path: '/reports/appointment-analytics'
    },
    {
      title: 'Revenue Reports',
      icon: TrendingUp,
      description: 'Analyze financial performance and revenue streams',
      path: '/reports/revenue-reports'
    },
    {
      title: 'Treatment Insights',
      icon: BarChart2,
      description: 'Monitor popular treatments and success rates',
      path: '/reports/treatment-insights'
    }
  ];

  const handleReportClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleReportClick(report.path)}
            >
              <div className="flex items-center mb-4">
                <Icon className="h-6 w-6 text-blue-500 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">{report.title}</h2>
              </div>
              <p className="text-gray-600">{report.description}</p>
              <button 
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReportClick(report.path);
                }}
              >
                View Report →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;