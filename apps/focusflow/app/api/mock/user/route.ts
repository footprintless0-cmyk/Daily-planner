import { NextRequest } from 'next/server';

// Mock data for testing
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  timezone: 'UTC',
  settings: {
    theme: 'light',
    notifications: {
      email: true,
      push: true,
    },
  },
};

export async function GET(request: NextRequest) {
  // Return fake data for testing
  return new Response(JSON.stringify(mockUser), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request: NextRequest) {
  // Return fake data for testing
  return new Response(JSON.stringify(mockUser), {
    headers: { 'Content-Type': 'application/json' },
  });
}