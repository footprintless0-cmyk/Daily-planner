'use client';

import { useState, useEffect } from 'react';
import ReminderConfig from '@/components/notifications/ReminderConfig';
import ExportDeleteUI from '@/components/settings/ExportDeleteUI';
import { getUserById, updateUser } from '@/lib/users';

const SettingsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: 'UTC',
    theme: 'system',
    notifications: {
      email: true,
      push: true,
    },
  });

  // In a real app, we would get the user ID from the session
  const userId = '1'; // Placeholder user ID

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // @ts-ignore - Will implement the actual function in the users service
      const userData = await getUserById(userId);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        timezone: userData.timezone || 'UTC',
        theme: userData.settings?.theme || 'system',
        notifications: userData.settings?.notifications || { email: true, push: true },
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (name.startsWith('notifications.')) {
      // Handle nested notifications settings
      const notificationType = name.split('.')[1] as 'email' | 'push';
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleReminderSettingsSave = (settings: any) => {
    // In a real implementation, this would save to the backend
    console.log('Saving reminder settings:', settings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare updated user data
      const updatedData = {
        name: formData.name,
        timezone: formData.timezone,
        settings: {
          theme: formData.theme,
          notifications: formData.notifications,
        },
      };
      
      // In a real implementation, we would call the API to update the user
      // const updatedUser = await updateUser(userId, updatedData);
      console.log('Updating user with data:', updatedData);
      
      // Update local state
      setUser(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your FocusFlow account settings
          </p>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'profile'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'reminders'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reminders')}
          >
            Reminders
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'account'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Shanghai">Shanghai</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <input
                      id="notifications.push"
                      name="notifications.push"
                      type="checkbox"
                      checked={formData.notifications.push}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="notifications.push" className="ml-2 block text-sm text-gray-900">
                      Enable push notifications
                    </label>
                  </div>
                  <div className="mt-2 flex items-center">
                    <input
                      id="notifications.email"
                      name="notifications.email"
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="notifications.email" className="ml-2 block text-sm text-gray-900">
                      Enable email notifications
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'reminders' && (
            <ReminderConfig 
              initialReminders={{
                taskDeadline: true,
                weeklyReview: false,
                dailyPlanning: true,
                preferredTime: '09:00',
                channel: 'push',
              }}
              onSave={handleReminderSettingsSave}
            />
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                <p className="text-gray-600 mb-4">
                  Export your data or delete your account.
                </p>
                <div className="mt-4">
                  <ExportDeleteUI userId={userId} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;