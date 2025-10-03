import { PrismaClient, User } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface CreateUserInput {
  email: string;
  name: string;
  timezone: string;
  settings?: any;
}

export interface UpdateUserInput {
  name?: string;
  timezone?: string;
  settings?: any;
}

export interface UserDataExport {
  user: User;
  tasks: any[]; // Task data
  sessions: any[]; // Session data
  reminders: any[]; // Reminder data
}

export async function createUser(data: CreateUserInput): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        timezone: data.timezone,
        settings: data.settings || {},
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

export async function exportUserData(userId: string): Promise<UserDataExport> {
  try {
    // Fetch user data
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch related data
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
    });

    const sessions = await prisma.session.findMany({
      where: {
        userId,
      },
    });

    const reminders = await prisma.reminder.findMany({
      where: {
        userId,
      },
    });

    return {
      user,
      tasks,
      sessions,
      reminders,
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export user data');
  }
}

// Update user settings
export async function updateUserSettings(userId: string, settings: any): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        settings,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Failed to update user settings');
  }
}

// Apply template to initialize user data
export async function applyUserTemplate(userId: string, templateName: string): Promise<{ message: string; createdTasksCount: number; createdTags: string[] }> {
  // This is a placeholder implementation
  // In a real application, you would have different templates with pre-defined tasks
  // For example, "Student Planner" might create tasks for classes, assignments, etc.
  
  try {
    // Placeholder for template implementation
    let createdTasksCount = 0;
    let createdTags: string[] = [];
    
    switch (templateName) {
      case 'Student Planner':
        // Create sample student tasks
        createdTasksCount = 5;
        createdTags = ['homework', 'exam', 'project'];
        break;
      case 'Business Sprint':
        // Create sample business tasks
        createdTasksCount = 7;
        createdTags = ['meeting', 'project', 'review'];
        break;
      default:
        return {
          message: 'Invalid template name',
          createdTasksCount: 0,
          createdTags: [],
        };
    }

    return {
      message: 'Template applied successfully',
      createdTasksCount,
      createdTags,
    };
  } catch (error) {
    console.error('Error applying template:', error);
    throw new Error('Failed to apply template');
  }
}