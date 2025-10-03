import prisma from '@/lib/prisma';

interface UpdateUserData {
  name?: string;
  timezone?: string;
  settings?: any;
}

export const userService = {
  // Get a user by ID
  async findById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          tasks: true,
          sessions: true,
          reminders: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  },

  // Update user profile
  async update(id: string, data: UpdateUserData) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          timezone: data.timezone,
          settings: data.settings,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },

  // Delete a user and all their data
  async delete(id: string) {
    try {
      // Delete all related data first (due to foreign key constraints)
      await prisma.reminder.deleteMany({ where: { userId: id } });
      await prisma.session.deleteMany({ where: { userId: id } });
      await prisma.task.deleteMany({ where: { userId: id } });

      // Then delete the user
      const deletedUser = await prisma.user.delete({
        where: { id },
      });

      return { id: deletedUser.id, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  },

  // Export user data in JSON format
  async exportUserData(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          tasks: true,
          sessions: true,
          reminders: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Return user data as JSON object
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          timezone: user.timezone,
          settings: user.settings,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tasks: user.tasks,
        sessions: user.sessions,
        reminders: user.reminders
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }
};