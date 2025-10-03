import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { taskService } from '@/lib/tasks';
import { TaskType, TaskStatus, TaskPriority } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { title, description, type, status, priority, tags, dueAt, estimateHrs, spentHrs, attachments, reminders } = await req.json();

    // Validate required fields
    if (!title || !type || !priority) {
      return new Response(
        JSON.stringify({ error: 'Title, type, and priority are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate enums
    if (!Object.values(TaskType).includes(type as TaskType)) {
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

    if (!Object.values(TaskPriority).includes(priority as TaskPriority)) {
      return new Response(
        JSON.stringify({ error: 'Invalid task priority' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the task
    const newTask = await taskService.create({
      userId: session.user.id,
      title,
      description,
      type: type as TaskType,
      status: status as TaskStatus || undefined,
      priority: priority as TaskPriority,
      tags,
      dueAt: dueAt ? new Date(dueAt) : undefined,
      estimateHrs,
      spentHrs,
      attachments,
      reminders: reminders ? reminders.map((r: string) => new Date(r)) : undefined,
    });

    // Calculate derived metrics
    const metrics = taskService.calculateTaskMetrics(newTask);
    const taskWithMetrics = { ...newTask, derived: metrics };

    return new Response(
      JSON.stringify(taskWithMetrics),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create task' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET /api/tasks endpoint (T022)
export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all tasks for the user
    const tasks = await taskService.findAll(session.user.id);

    // Calculate derived metrics for each task
    const tasksWithMetrics = tasks.map(task => {
      const metrics = taskService.calculateTaskMetrics(task);
      return { ...task, derived: metrics };
    });

    return new Response(
      JSON.stringify(tasksWithMetrics),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tasks' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}