import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { taskService } from '@/lib/tasks';
import { TaskType, TaskStatus, TaskPriority } from '@prisma/client';

// Helper function to get task ID from URL
function getTaskId(req: NextRequest): string | null {
  const parts = req.url.split('/');
  const idIndex = parts.indexOf('tasks') + 1;
  if (idIndex < parts.length) {
    return parts[idIndex];
  }
  return null;
}

// GET /api/tasks/[id] endpoint (T025)
export async function GET(req: NextRequest) {
  try {
    const taskId = getTaskId(req);
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the task
    const task = await taskService.findById(taskId, session.user.id);

    // Calculate derived metrics
    const metrics = taskService.calculateTaskMetrics(task);
    const taskWithMetrics = { ...task, derived: metrics };

    return new Response(
      JSON.stringify(taskWithMetrics),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching task:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch task' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/tasks/[id] endpoint (T023)
export async function PUT(req: NextRequest) {
  try {
    const taskId = getTaskId(req);
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { title, description, type, status, priority, tags, dueAt, estimateHrs, spentHrs, attachments, reminders } = await req.json();

    // Validate enums if provided
    if (type && !Object.values(TaskType).includes(type as TaskType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid task type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
      return new Response(
        JSON.stringify({ error: 'Invalid task status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (priority && !Object.values(TaskPriority).includes(priority as TaskPriority)) {
      return new Response(
        JSON.stringify({ error: 'Invalid task priority' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the task
    const updatedTask = await taskService.update(taskId, session.user.id, {
      title,
      description,
      type: type as TaskType,
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      tags,
      dueAt: dueAt ? new Date(dueAt) : undefined,
      estimateHrs,
      spentHrs,
      attachments,
      reminders: reminders ? reminders.map((r: string) => new Date(r)) : undefined,
    });

    // Calculate derived metrics
    const metrics = taskService.calculateTaskMetrics(updatedTask);
    const taskWithMetrics = { ...updatedTask, derived: metrics };

    return new Response(
      JSON.stringify(taskWithMetrics),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update task' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/tasks/[id] endpoint (T024)
export async function DELETE(req: NextRequest) {
  try {
    const taskId = getTaskId(req);
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the task
    await taskService.delete(taskId, session.user.id);

    return new Response(
      JSON.stringify({ message: 'Task deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete task' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}