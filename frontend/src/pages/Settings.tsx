import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="w-7 h-7 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
      </div>

      <form className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Clinic Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Clinic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Clinic Name" className="p-2 border rounded" />
            <input type="text" placeholder="Address" className="p-2 border rounded" />
            <input type="tel" placeholder="Phone" className="p-2 border rounded" />
            <input type="email" placeholder="Email" className="p-2 border rounded" />
          </div>
        </section>

        {/* Clinic Hours */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Clinic Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <div key={day}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{day}</label>
                <input type="text" placeholder="e.g., 09:00 - 17:00" className="w-full p-2 border rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Payment & Insurance Providers */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment & Insurance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods</label>
              <input type="text" placeholder="Cash, Card, Insurance" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Providers</label>
              <input type="text" placeholder="Provider1, Provider2" className="w-full p-2 border rounded" />
            </div>
          </div>
        </section>

        {/* Reminders & Notifications */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reminders & Notifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Appointment Reminders</p>
              {['email', 'sms', 'push'].map(method => (
                <label key={method} className="inline-flex items-center mr-4">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 capitalize">{method}</span>
                </label>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Notification Settings</p>
              {['email', 'sms', 'push'].map(method => (
                <label key={method} className="inline-flex items-center mr-4">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Data Backup */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Backup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
              <select className="w-full p-2 border rounded">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Backup Date</label>
              <input type="date" className="w-full p-2 border rounded" />
            </div>
          </div>
        </section>

        {/* User Management */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Roles</p>
              {['admin', 'dentist', 'receptionist', 'nurse'].map(role => (
                <label key={role} className="inline-flex items-center mr-4">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 capitalize">{role}</span>
                </label>
              ))}
            </div>
            <div className="overflow-y-auto max-h-64">
              <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
              {['viewPatients', 'editPatients', 'viewAppointments', 'editAppointments'].map(perm => (
                <label key={perm} className="inline-flex items-center w-full mb-1">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm">{perm}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
