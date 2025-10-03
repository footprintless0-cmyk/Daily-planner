import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { sessionService } from '@/lib/sessions';
import { SessionType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { taskId, startAt, type, plannedMins, notes } = await req.json();

    // Validate required fields
    if (!startAt || !type || plannedMins === undefined) {
      return new Response(
        JSON.stringify({ error: 'startAt, type, and plannedMins are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate enum
    if (!Object.values(SessionType).includes(type as SessionType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid session type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create the session
    const newSession = await sessionService.create({
      userId: session.user.id,
      taskId,
      startAt: new Date(startAt),
      type: type as SessionType,
      plannedMins,
      notes,
    });

    return new Response(
      JSON.stringify(newSession),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// GET /api/sessions endpoint (T027)
export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const authSession = await auth();
    if (!authSession?.user?.id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all sessions for the user
    const sessions = await sessionService.findAll(authSession.user.id);

    return new Response(
      JSON.stringify(sessions),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch sessions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}