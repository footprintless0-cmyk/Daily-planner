'use client';

import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FocusFlow</h1>
          <p className="text-lg text-gray-600 mb-8">Your comprehensive task management and focus application</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/kanban" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Kanban Board</h2>
              <p className="text-gray-600">Visual task management with drag-and-drop functionality</p>
            </Link>
            
            <Link href="/list" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Task List</h2>
              <p className="text-gray-600">Simple list view for managing your tasks</p>
            </Link>
            
            <Link href="/calendar" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Calendar View</h2>
              <p className="text-gray-600">View your tasks on a calendar</p>
            </Link>
            
            <Link href="/focus" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Focus Room</h2>
              <p className="text-gray-600">Pomodoro timer for concentrated work sessions</p>
            </Link>
            
            <Link href="/settings" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Settings</h2>
              <p className="text-gray-600">Manage your account and preferences</p>
            </Link>
            
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 lg:col-span-1">
              <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
              <p className="text-gray-600 mb-4">Get started with FocusFlow today</p>
              <Link 
                href="/kanban" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Begin with Kanban
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}