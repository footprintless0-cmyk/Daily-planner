import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { createTask, calculateETA, calculateTimeLeft } from '@/lib/tasks';

export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const session = await auth();
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.title) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'Title is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate other fields according to data-model.md
    const allowedTypes = ['task', 'exam', 'meeting'];
    const allowedStatuses = ['Backlog', 'Todo', 'Doing', 'Done'];
    const allowedPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    
    if (body.type && !allowedTypes.includes(body.type)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: `Type must be one of: ${allowedTypes.join(', ')}` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (body.status && !allowedStatuses.includes(body.status)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: `Status must be one of: ${allowedStatuses.join(', ')}` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (body.priority && !allowedPriorities.includes(body.priority)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: `Priority must be one of: ${allowedPriorities.join(', ')}` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.estimateHrs !== undefined && body.estimateHrs < 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'Estimate hours must be a positive number' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.spentHrs !== undefined && body.spentHrs < 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'Spent hours must be a positive number' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.dueAt && new Date(body.dueAt) < new Date()) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'Due date must be in the future' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the task
    const newTask = await createTask({
      userId,
      title: body.title,
      description: body.description,
      type: body.type || 'task',
      status: body.status || 'Todo',
      priority: body.priority || 'Medium',
      tags: body.tags,
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      estimateHrs: body.estimateHrs,
      spentHrs: body.spentHrs || 0,
      attachments: body.attachments,
      reminders: body.reminders ? body.reminders.map((r: string) => new Date(r)) : [],
    });

    // Calculate derived fields
    const eta = calculateETA(newTask.estimateHrs, newTask.spentHrs);
    const timeLeft = calculateTimeLeft(newTask.dueAt);

    // Return the created task with derived fields
    return new Response(
      JSON.stringify({
        ...newTask,
        eta: eta ? eta.toISOString() : null,
        timeLeft: timeLeft,
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate the request
    const session = await auth();
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const dueAfter = searchParams.get('dueAfter');
    const dueBefore = searchParams.get('dueBefore');
    const tag = searchParams.get('tag');

    // Call the tasks service to get tasks
    const tasks = await import('@/lib/tasks').then(mod => mod.getTasksByUserId(userId, {
      status: status || undefined,
      type: type || undefined,
      priority: priority || undefined,
      dueAfter: dueAfter ? new Date(dueAfter) : undefined,
      dueBefore: dueBefore ? new Date(dueBefore) : undefined,
      tag: tag || undefined,
    }));

    // Calculate derived fields for each task
    const tasksWithDerived = tasks.map(task => {
      const eta = calculateETA(task.estimateHrs, task.spentHrs);
      const timeLeft = calculateTimeLeft(task.dueAt);
      return {
        ...task,
        eta: eta ? eta.toISOString() : null,
        timeLeft: timeLeft,
      };
    });

    return new Response(
      JSON.stringify({ tasks: tasksWithDerived }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}