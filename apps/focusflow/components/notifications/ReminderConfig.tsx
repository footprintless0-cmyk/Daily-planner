'use client';

import { useState } from 'react';

interface ReminderConfigProps {
  initialReminders?: {
    taskDeadline: boolean;
    weeklyReview: boolean;
    dailyPlanning: boolean;
    preferredTime: string;
    channel: 'push' | 'email' | 'both';
  };
  onSave: (settings: any) => void;
}

const ReminderConfig: React.FC<ReminderConfigProps> = ({ initialReminders, onSave }) => {
  const [settings, setSettings] = useState({
    taskDeadline: initialReminders?.taskDeadline ?? true,
    weeklyReview: initialReminders?.weeklyReview ?? false,
    dailyPlanning: initialReminders?.dailyPlanning ?? true,
    preferredTime: initialReminders?.preferredTime ?? '09:00',
    channel: initialReminders?.channel ?? 'push',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Reminder Settings</h2>
      
      <div className="space-y-4">
        {/* Task Deadline Reminder */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Task Deadline Reminders</p>
            <p className="text-sm text-gray-500">Get reminded before task deadlines</p>
          </div>
          <input
            type="checkbox"
            name="taskDeadline"
            checked={settings.taskDeadline}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Weekly Review Reminder */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Weekly Review Reminder</p>
            <p className="text-sm text-gray-500">Get reminded to review your tasks weekly</p>
          </div>
          <input
            type="checkbox"
            name="weeklyReview"
            checked={settings.weeklyReview}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Daily Planning Reminder */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Daily Planning Reminder</p>
            <p className="text-sm text-gray-500">Get reminded to plan your day</p>
          </div>
          <input
            type="checkbox"
            name="dailyPlanning"
            checked={settings.dailyPlanning}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Preferred Time */}
        <div>
          <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Reminder Time
          </label>
          <input
            type="time"
            id="preferredTime"
            name="preferredTime"
            value={settings.preferredTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Notification Channel */}
        <div>
          <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-1">
            Notification Channel
          </label>
          <select
            id="channel"
            name="channel"
            value={settings.channel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="push">Push Notification</option>
            <option value="email">Email</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default ReminderConfig;