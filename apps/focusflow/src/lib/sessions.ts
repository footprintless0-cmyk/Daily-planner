import prisma from '@/lib/prisma';
import { SessionType } from '@prisma/client';

interface CreateSessionData {
  userId: string;
  taskId?: string;
  startAt: Date;
  type: SessionType;
  plannedMins: number;
  notes?: string;
}

interface UpdateSessionData {
  endAt?: Date;
  actualMins?: number;
  notes?: string;
}

export const sessionService = {
  // Create a new session
  async create(data: CreateSessionData) {
    try {
      const session = await prisma.session.create({
        data: {
          userId: data.userId,
          taskId: data.taskId,
          startAt: data.startAt,
          type: data.type,
          plannedMins: data.plannedMins,
          notes: data.notes,
        },
        include: {
          user: true,
          task: true
        }
      });
      
      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }
  },

  // Get all sessions for a user
  async findAll(userId: string) {
    try {
      const sessions = await prisma.session.findMany({
        where: { userId },
        include: {
          user: true,
          task: true
        },
        orderBy: { startAt: 'desc' }
      });
      
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('Failed to fetch sessions');
    }
  },

  // Get a single session by ID
  async findById(id: string, userId: string) {
    try {
      const session = await prisma.session.findFirst({
        where: { id, userId },
        include: {
          user: true,
          task: true
        }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      return session;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw new Error('Failed to fetch session');
    }
  },

  // Update a session
  async update(id: string, userId: string, data: UpdateSessionData) {
    try {
      const existingSession = await prisma.session.findFirst({
        where: { id, userId }
      });

      if (!existingSession) {
        throw new Error('Session not found');
      }

      const updatedSession = await prisma.session.update({
        where: { id },
        data: {
          endAt: data.endAt,
          actualMins: data.actualMins,
          notes: data.notes,
        },
        include: {
          user: true,
          task: true
        }
      });

      return updatedSession;
    } catch (error) {
      console.error('Error updating session:', error);
      throw new Error('Failed to update session');
    }
  },

  // Delete a session
  async delete(id: string, userId: string) {
    try {
      const existingSession = await prisma.session.findFirst({
        where: { id, userId }
      });

      if (!existingSession) {
        throw new Error('Session not found');
      }

      await prisma.session.delete({
        where: { id }
      });
      
      return { id, message: 'Session deleted successfully' };
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  },
};