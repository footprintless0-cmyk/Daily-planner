import { PrismaClient, Session } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface CreateSessionData {
  userId: string;
  taskId?: string;
  startAt: Date;
  endAt?: Date;
  type: string; // 'Pomodoro' | 'Custom'
  plannedMins: number;
  actualMins?: number;
  notes?: string;
}

export interface UpdateSessionData {
  endAt?: Date;
  actualMins?: number;
  notes?: string;
}

export async function createSession(data: CreateSessionData): Promise<Session> {
  try {
    const session = await prisma.session.create({
      data: {
        userId: data.userId,
        taskId: data.taskId,
        startAt: data.startAt,
        endAt: data.endAt,
        type: data.type,
        plannedMins: data.plannedMins,
        actualMins: data.actualMins,
        notes: data.notes,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
}

export async function getSessionById(id: string, userId: string): Promise<Session | null> {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id,
        userId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw new Error('Failed to fetch session');
  }
}

export async function getSessionsByUserId(
  userId: string,
  filters?: {
    taskId?: string;
    type?: string;
    from?: Date;
    to?: Date;
  }
): Promise<Session[]> {
  try {
    const whereClause: any = { userId };

    if (filters) {
      if (filters.taskId) whereClause.taskId = filters.taskId;
      if (filters.type) whereClause.type = filters.type;
      if (filters.from) whereClause.startAt = { gte: filters.from };
      if (filters.to) {
        whereClause.startAt = whereClause.startAt 
          ? { ...whereClause.startAt, lte: filters.to } 
          : { lte: filters.to };
      }
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      orderBy: {
        startAt: 'desc',
      },
    });

    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw new Error('Failed to fetch sessions');
  }
}

export async function updateSession(id: string, userId: string, data: UpdateSessionData): Promise<Session> {
  try {
    const session = await prisma.session.update({
      where: {
        id,
        userId,
      },
      data: {
        ...data,
      },
    });

    return session;
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
}

export async function deleteSession(id: string, userId: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: {
        id,
        userId,
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete session');
  }
}

// Helper function to calculate session duration
export function calculateSessionDuration(startAt: Date, endAt?: Date): number | null {
  if (!endAt) {
    return null; // Session is ongoing
  }
  
  const durationMs = endAt.getTime() - startAt.getTime();
  return Math.round(durationMs / (1000 * 60)); // Return duration in minutes
}

// Helper function to calculate effectiveness percentage
// Based on planned vs actual minutes
export function calculateEffectiveness(plannedMins: number, actualMins?: number): number | null {
  if (actualMins === undefined || actualMins === null) {
    return null; // Session still ongoing
  }
  
  // Calculate effectiveness as actual minutes compared to planned
  // 100% would mean you spent exactly as long as planned
  return Math.round((actualMins / plannedMins) * 100);
}