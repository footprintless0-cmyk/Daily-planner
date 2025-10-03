import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { getTaskById, updateTask, deleteTask, calculateETA, calculateTimeLeft } from '@/lib/tasks';
import { getServerSession } from 'next-auth';

// GET /api/tasks/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Authenticate the request
    const session = await getServerSession(auth);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    const taskId = params.id;

    // Get the task
    const task = await getTaskById(taskId, userId);

    if (!task) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate derived fields
    const eta = calculateETA(task.estimateHrs, task.spentHrs);
    const timeLeft = calculateTimeLeft(task.dueAt);

    return new Response(
      JSON.stringify({
        ...task,
        eta: eta ? eta.toISOString() : null,
        timeLeft: timeLeft,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching task:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/tasks/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Authenticate the request
    const session = await getServerSession(auth);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    const taskId = params.id;

    // Check if task exists
    const existingTask = await getTaskById(taskId, userId);
    if (!existingTask) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Validate fields according to data-model.md if they are being updated
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

    // Update the task
    const updatedTask = await updateTask(taskId, userId, {
      title: body.title,
      description: body.description,
      type: body.type,
      status: body.status,
      priority: body.priority,
      tags: body.tags,
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      estimateHrs: body.estimateHrs,
      spentHrs: body.spentHrs,
      attachments: body.attachments,
      reminders: body.reminders ? body.reminders.map((r: string) => new Date(r)) : undefined,
    });

    // Calculate derived fields
    const eta = calculateETA(updatedTask.estimateHrs, updatedTask.spentHrs);
    const timeLeft = calculateTimeLeft(updatedTask.dueAt);

    return new Response(
      JSON.stringify({
        ...updatedTask,
        eta: eta ? eta.toISOString() : null,
        timeLeft: timeLeft,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Authenticate the request
    const session = await getServerSession(auth);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;
    const taskId = params.id;

    // Check if task exists
    const existingTask = await getTaskById(taskId, userId);
    if (!existingTask) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the task
    const success = await deleteTask(taskId, userId);

    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error', 
          details: 'Failed to delete task' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}