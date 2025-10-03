import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserById, updateUser } from '@/lib/users';
import { getServerSession } from 'next-auth';

// GET /api/user/profile
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

    // Get the user
    const user = await getUserById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone,
        settings: user.settings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/user/profile
export async function PUT(req: NextRequest) {
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
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Update the user
    const updatedUser = await updateUser(userId, {
      name: body.name,
      timezone: body.timezone,
      settings: body.settings,
    });

    return new Response(
      JSON.stringify({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        timezone: updatedUser.timezone,
        settings: updatedUser.settings,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}