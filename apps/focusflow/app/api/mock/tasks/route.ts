import { NextRequest } from 'next/server';

// Mock data for testing
const mockTasks = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    type: 'task',
    status: 'Todo',
    priority: 'Medium',
    dueAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    estimateHrs: 2,
    spentHrs: 0.5,
  },
  {
    id: '2',
    title: 'Another Task',
    description: 'This is another sample task',
    type: 'task',
    status: 'Doing',
    priority: 'High',
    dueAt: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    estimateHrs: 4,
    spentHrs: 1,
  },
];

export async function GET(request: NextRequest) {
  // Return fake data for testing
  return new Response(JSON.stringify({ tasks: mockTasks }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  // Return fake data for testing
  const newTask = {
    id: '3',
    title: 'New Task',
    description: 'This is a new task',
    type: 'task',
    status: 'Todo',
    priority: 'Medium',
    dueAt: null,
    estimateHrs: 1,
    spentHrs: 0,
  };
  
  return new Response(JSON.stringify(newTask), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}