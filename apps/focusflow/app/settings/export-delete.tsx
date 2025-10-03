'use client';

import { useState } from 'react';
import ExportDeleteUI from '@/components/settings/ExportDeleteUI';

const ExportDeletePage = () => {
  // In a real application, we would get the user ID from the session
  const userId = '1'; // Placeholder user ID

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Export and Delete Data</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your FocusFlow data export and account deletion
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <ExportDeleteUI userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ExportDeletePage;