import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { userService } from '@/lib/users';

// GET /api/user/export endpoint (T033)
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

    // Export user data
    const userData = await userService.exportUserData(session.user.id);

    // Return user data as JSON
    return new Response(
      JSON.stringify(userData),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="user-data.json"'
        } 
      }
    );
  } catch (error) {
    console.error('Error exporting user data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to export user data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/user endpoint (T034)
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the user and all their data
    const result = await userService.delete(session.user.id);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}