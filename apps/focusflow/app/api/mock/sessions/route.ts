import { NextRequest } from 'next/server';

// Mock data for testing
const mockSessions = [
  {
    id: '1',
    startAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    endAt: new Date().toISOString(),
    type: 'Pomodoro',
    plannedMins: 25,
    actualMins: 25,
    notes: 'Focused work session',
  },
  {
    id: '2',
    startAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endAt: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
    type: 'Custom',
    plannedMins: 30,
    actualMins: 25,
    notes: 'Custom work session',
  },
];

export async function GET(request: NextRequest) {
  // Return fake data for testing
  return new Response(JSON.stringify({ sessions: mockSessions }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  // Return fake data for testing
  const newSession = {
    id: '3',
    startAt: new Date().toISOString(),
    endAt: null,
    type: 'Pomodoro',
    plannedMins: 25,
    actualMins: null,
    notes: '',
  };
  
  return new Response(JSON.stringify(newSession), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}