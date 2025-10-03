import prisma from '@/lib/prisma';
import { TaskType, TaskStatus, TaskPriority } from '@prisma/client';

interface CreateTaskData {
  userId: string;
  title: string;
  description?: string;
  type: TaskType;
  status?: TaskStatus;
  priority: TaskPriority;
  tags?: string[];
  dueAt?: Date;
  estimateHrs?: number;
  spentHrs?: number;
  attachments?: any[];
  reminders?: Date[];
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  dueAt?: Date;
  estimateHrs?: number;
  spentHrs?: number;
  attachments?: any[];
  reminders?: Date[];
}

export const taskService = {
  // Create a new task
  async create(data: CreateTaskData) {
    try {
      const task = await prisma.task.create({
        data: {
          userId: data.userId,
          title: data.title,
          description: data.description,
          type: data.type,
          status: data.status || 'Todo', // Default status
          priority: data.priority,
          tags: JSON.stringify(data.tags || []),
          dueAt: data.dueAt,
          estimateHrs: data.estimateHrs,
          spentHrs: data.spentHrs || 0,
          attachments: data.attachments || [],
          reminders: JSON.stringify(data.reminders || []),
        },
        include: {
          user: true
        }
      });
      
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  // Get all tasks for a user
  async findAll(userId: string) {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId },
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      });
      
      // Parse tags and reminders from JSON strings
      return tasks.map(task => ({
        ...task,
        tags: JSON.parse(task.tags),
        reminders: JSON.parse(task.reminders)
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  // Get a single task by ID
  async findById(id: string, userId: string) {
    try {
      const task = await prisma.task.findFirst({
        where: { id, userId },
        include: {
          user: true
        }
      });

      if (!task) {
        throw new Error('Task not found');
      }

      return {
        ...task,
        tags: JSON.parse(task.tags),
        reminders: JSON.parse(task.reminders)
      };
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }
  },

  // Update a task
  async update(id: string, userId: string, data: UpdateTaskData) {
    try {
      const existingTask = await prisma.task.findFirst({
        where: { id, userId }
      });

      if (!existingTask) {
        throw new Error('Task not found');
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          status: data.status,
          priority: data.priority,
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
          dueAt: data.dueAt,
          estimateHrs: data.estimateHrs,
          spentHrs: data.spentHrs,
          attachments: data.attachments,
          reminders: data.reminders ? JSON.stringify(data.reminders) : undefined,
        },
        include: {
          user: true
        }
      });

      return {
        ...updatedTask,
        tags: JSON.parse(updatedTask.tags),
        reminders: JSON.parse(updatedTask.reminders)
      };
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  // Delete a task
  async delete(id: string, userId: string) {
    try {
      const existingTask = await prisma.task.findFirst({
        where: { id, userId }
      });

      if (!existingTask) {
        throw new Error('Task not found');
      }

      await prisma.task.delete({
        where: { id }
      });
      
      return { id, message: 'Task deleted successfully' };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  // Calculate ETA and timeLeft for a task
  calculateTaskMetrics(task: any) {
    const now = new Date();
    let eta: Date | null = null;
    let timeLeft: number | null = null;

    if (task.estimateHrs !== null && task.spentHrs !== null) {
      const remainingHrs = task.estimateHrs - task.spentHrs;
      if (remainingHrs > 0) {
        // ETA = now + remaining hours
        eta = new Date(now.getTime() + remainingHrs * 60 * 60 * 1000);
      }
    }

    if (task.dueAt) {
      // timeLeft = dueAt - now
      timeLeft = (new Date(task.dueAt).getTime() - now.getTime()) / (1000 * 60 * 60); // in hours
    }

    return { eta, timeLeft };
  },
};