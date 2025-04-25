import React from 'react';
import { 
  Users, Calendar, FileText, DollarSign,
  TrendingUp, AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Patients', stat: '1,284', icon: Users, change: '+4.75%' },
    { name: 'Today\'s Appointments', stat: '12', icon: Calendar, change: '' },
    { name: 'Pending Treatments', stat: '24', icon: FileText, change: '' },
    { name: 'Monthly Revenue', stat: '$13,245', icon: DollarSign, change: '+10.2%' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-4">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 rounded-lg overflow-hidden shadow"
              >
                <dt>
                  <div className="absolute bg-blue-500 rounded-md p-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.stat}
                  </p>
                  {item.change && (
                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                      <span className="sr-only">Increased by</span>
                      {item.change}
                    </p>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Appointments
                  </dt>
                  <dd>
                    <div className="mt-4 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">John Smith</p>
                            <p className="text-sm text-gray-500">Dental Cleaning</p>
                          </div>
                          <p className="text-sm text-gray-500">10:00 AM</p>
                        </div>
                      ))}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recent Activities
                  </dt>
                  <dd>
                    <div className="mt-4 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">New patient registration completed</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;