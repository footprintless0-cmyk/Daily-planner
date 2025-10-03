'use client';

import { useState } from 'react';
import FocusTimer from '@/components/focus/FocusTimer';
import { createSession } from '@/lib/sessions';

const FocusRoomPage = () => {
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string>('default');

  // Background options
  const backgrounds = [
    { id: 'default', name: 'Default', color: 'bg-gray-100' },
    { id: 'ocean', name: 'Ocean View', color: 'bg-blue-400' },
    { id: 'forest', name: 'Forest', color: 'bg-green-500' },
    { id: 'mountain', name: 'Mountains', color: 'bg-purple-400' },
    { id: 'desert', name: 'Desert', color: 'bg-yellow-300' },
  ];

  const handleTimerComplete = async (sessionData: any) => {
    try {
      // In a real implementation, we would call the API to save the session
      // Here we'll just add it to the history
      const newSession = {
        id: `session-${Date.now()}`,
        ...sessionData,
        timestamp: new Date().toISOString(),
      };
      
      setSessionHistory(prev => [newSession, ...prev]);
      
      // In a real app, we might want to save this to the database
      // await createSession({ ...sessionData, userId: 'current-user-id' });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  return (
    <div className={`min-h-screen ${backgrounds.find(b => b.id === selectedBackground)?.color || 'bg-gray-100'} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Room</h1>
          <p className="text-lg text-gray-600">Dedicated space for deep work and concentration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <FocusTimer onTimerComplete={handleTimerComplete} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Background Selector */}
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Background</h2>
              <div className="grid grid-cols-3 gap-3">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBackground(bg.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 ${
                      selectedBackground === bg.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${bg.color}`}></div>
                    <span className="mt-2 text-xs">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Sessions</h2>
              {sessionHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No sessions yet. Start a focus session to see history here.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sessionHistory.map((session, index) => (
                    <div 
                      key={session.id || index} 
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{session.type}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Planned: {session.plannedMins}m | Actual: {session.actualMins}m
                      </div>
                      {session.notes && (
                        <div className="mt-1 text-xs text-gray-500 truncate">
                          Note: {session.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoomPage;