import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { userService } from '@/lib/users';

// GET /api/user/profile endpoint (T031)
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

    // Get the user profile
    const user = await userService.findById(session.user.id);

    // Return user profile (without sensitive data)
    const { id, email, name, timezone, settings, createdAt, updatedAt } = user;
    const userProfile = { id, email, name, timezone, settings, createdAt, updatedAt };

    return new Response(
      JSON.stringify(userProfile),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/user/profile endpoint (T032)
export async function PUT(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, timezone, settings } = await req.json();

    // Update the user profile
    const updatedUser = await userService.update(session.user.id, {
      name,
      timezone,
      settings,
    });

    // Return updated user profile (without sensitive data)
    const { id, email, createdAt, updatedAt } = updatedUser;
    const userProfile = { id, email, name: updatedUser.name, timezone: updatedUser.timezone, settings: updatedUser.settings, createdAt, updatedAt };

    return new Response(
      JSON.stringify(userProfile),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update user profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}