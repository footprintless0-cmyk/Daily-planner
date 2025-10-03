import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { createSession, getSessionsByUserId } from '@/lib/sessions';
import { getServerSession } from 'next-auth';
import { calculateSessionDuration, calculateEffectiveness } from '@/lib/sessions';

export async function POST(req: NextRequest) {
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

    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.startAt) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'startAt is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.type) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'type is required (Pomodoro or Custom)' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.type !== 'Pomodoro' && body.type !== 'Custom') {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'type must be either Pomodoro or Custom' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.plannedMins === undefined || body.plannedMins <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'plannedMins is required and must be a positive number' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate that taskId exists if provided
    if (body.taskId) {
      // In a real implementation, we would check if the task exists
      // For now, we'll just proceed with the creation
    }

    // Create the session
    const newSession = await createSession({
      userId,
      taskId: body.taskId,
      startAt: new Date(body.startAt),
      endAt: body.endAt ? new Date(body.endAt) : undefined,
      type: body.type,
      plannedMins: body.plannedMins,
      actualMins: body.actualMins,
      notes: body.notes,
    });

    // Calculate derived fields
    const duration = calculateSessionDuration(newSession.startAt, newSession.endAt);
    const effectiveness = calculateEffectiveness(newSession.plannedMins, newSession.actualMins);

    // Return the created session with derived fields
    return new Response(
      JSON.stringify({
        ...newSession,
        duration,
        effectiveness,
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error creating session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

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

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Call the sessions service to get sessions
    const sessions = await getSessionsByUserId(userId, {
      taskId: taskId || undefined,
      type: type || undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });

    // Calculate derived fields for each session
    const sessionsWithDerived = sessions.map(session => {
      const duration = calculateSessionDuration(session.startAt, session.endAt);
      const effectiveness = calculateEffectiveness(session.plannedMins, session.actualMins);
      return {
        ...session,
        duration,
        effectiveness,
      };
    });

    return new Response(
      JSON.stringify({ sessions: sessionsWithDerived }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}