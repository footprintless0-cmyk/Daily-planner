import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { exportUserData, deleteUser, applyUserTemplate } from '@/lib/users';
import { getServerSession } from 'next-auth';

// GET /api/user/export
export async function GET(req: NextRequest) {
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

    // Export user data
    const userData = await exportUserData(userId);

    return new Response(
      JSON.stringify(userData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error exporting user data:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/user
export async function DELETE(req: NextRequest) {
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

    // Check if user exists
    const existingUser = await import('@/lib/users').then(mod => mod.getUserById(userId));
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the user account and all related data
    const success = await deleteUser(userId);

    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error', 
          details: 'Failed to delete user' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}