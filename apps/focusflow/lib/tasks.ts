import { PrismaClient, Task } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface CreateTaskData {
  userId: string;
  title: string;
  description?: string;
  type: string; // 'task' | 'exam' | 'meeting'
  status: string; // 'Backlog' | 'Todo' | 'Doing' | 'Done'
  priority: string; // 'Low' | 'Medium' | 'High' | 'Urgent'
  tags?: string[];
  dueAt?: Date;
  estimateHrs?: number;
  spentHrs?: number;
  attachments?: any[];
  reminders?: Date[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  dueAt?: Date;
  estimateHrs?: number;
  spentHrs?: number;
  attachments?: any[];
  reminders?: Date[];
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  try {
    // Additional validation could be added here
    // For example: validate that estimateHrs is positive if provided
    // and that spentHrs doesn't exceed estimateHrs if both provided
    
    const task = await prisma.task.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        priority: data.priority,
        tags: data.tags || [],
        dueAt: data.dueAt,
        estimateHrs: data.estimateHrs,
        spentHrs: data.spentHrs,
        attachments: data.attachments || [],
        reminders: data.reminders || [],
      },
    });

    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
}

export async function getTaskById(id: string, userId: string): Promise<Task | null> {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    return task;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw new Error('Failed to fetch task');
  }
}

export async function getTasksByUserId(
  userId: string,
  filters?: {
    status?: string;
    type?: string;
    priority?: string;
    dueAfter?: Date;
    dueBefore?: Date;
    tag?: string;
  }
): Promise<Task[]> {
  try {
    const whereClause: any = { userId };

    if (filters) {
      if (filters.status) whereClause.status = filters.status;
      if (filters.type) whereClause.type = filters.type;
      if (filters.priority) whereClause.priority = filters.priority;
      if (filters.dueAfter) whereClause.dueAt = { gte: filters.dueAfter };
      if (filters.dueBefore) {
        whereClause.dueAt = whereClause.dueAt 
          ? { ...whereClause.dueAt, lte: filters.dueBefore } 
          : { lte: filters.dueBefore };
      }
      if (filters.tag) {
        // Note: Since tags is a string array, we need to check if the tag exists in the array
        // This is a simplified check - in a real app, you might need a more complex query
        whereClause.tags = { has: filters.tag }; // This assumes tags is stored as a JSON array
      }
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function updateTask(id: string, userId: string, data: UpdateTaskData): Promise<Task> {
  try {
    const task = await prisma.task.update({
      where: {
        id,
        userId,
      },
      data: {
        ...data,
        // Only update tags, attachments, and reminders if provided
        tags: data.tags ? data.tags : undefined,
        attachments: data.attachments ? data.attachments : undefined,
        reminders: data.reminders ? data.reminders : undefined,
      },
    });

    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(id: string, userId: string): Promise<boolean> {
  try {
    await prisma.task.delete({
      where: {
        id,
        userId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
}

// Helper function to calculate ETA (Estimated Time of Arrival)
// ETA = now + (estimateHrs - spentHrs)
export function calculateETA(estimateHrs?: number, spentHrs?: number): Date | null {
  if (estimateHrs === undefined || spentHrs === undefined) {
    return null;
  }

  const remainingHours = estimateHrs - spentHrs;
  if (remainingHours <= 0) {
    return new Date(); // Task should already be completed
  }

  const now = new Date();
  const eta = new Date(now.getTime() + remainingHours * 60 * 60 * 1000);
  return eta;
}

// Helper function to calculate timeLeft until due date
// timeLeft = dueAt - now (in milliseconds)
export function calculateTimeLeft(dueAt?: Date): number | null {
  if (!dueAt) {
    return null;
  }

  const now = new Date();
  const timeLeft = dueAt.getTime() - now.getTime();
  
  // Return time in milliseconds; negative if overdue
  return timeLeft;
}