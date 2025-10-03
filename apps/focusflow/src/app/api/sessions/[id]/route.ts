import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { sessionService } from '@/lib/sessions';
import { SessionType } from '@prisma/client';

// Helper function to get session ID from URL
function getSessionId(req: NextRequest): string | null {
  const parts = req.url.split('/');
  const idIndex = parts.indexOf('sessions') + 1;
  if (idIndex < parts.length) {
    return parts[idIndex];
  }
  return null;
}

// GET /api/sessions/[id] endpoint (T030)
export async function GET(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the session
    const result = await sessionService.findById(sessionId, session.user.id);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/sessions/[id] endpoint (T028)
export async function PUT(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const authSession = await auth();
    if (!authSession?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { endAt, actualMins, notes } = await req.json();

    // Update the session
    const updatedSession = await sessionService.update(sessionId, authSession.user.id, {
      endAt: endAt ? new Date(endAt) : undefined,
      actualMins,
      notes,
    });

    return new Response(
      JSON.stringify(updatedSession),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/sessions/[id] endpoint (T029)
export async function DELETE(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the session
    await sessionService.delete(sessionId, session.user.id);

    return new Response(
      JSON.stringify({ message: 'Session deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}