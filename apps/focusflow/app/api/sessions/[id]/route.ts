import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { getSessionById, updateSession, deleteSession } from '@/lib/sessions';
import { calculateSessionDuration, calculateEffectiveness } from '@/lib/sessions';

// GET /api/sessions/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // In Next.js dynamic routes, the id parameter is guaranteed to be present
  // Type assertion since we know it will always be a string
  try {
    // Authenticate the request
    const session = await auth();
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // Get the session
    // Using non-null assertion since we know id will always be a string in a dynamic route
    const sessionData = await getSessionById(id, userId);

    if (!sessionData) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate derived fields
    const duration = calculateSessionDuration(sessionData.startAt, sessionData.endAt);
    const effectiveness = calculateEffectiveness(sessionData.plannedMins, sessionData.actualMins);

    return new Response(
      JSON.stringify({
        ...sessionData,
        duration,
        effectiveness,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PUT /api/sessions/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // In Next.js dynamic routes, the id parameter is guaranteed to be present
  // Type assertion since we know it will always be a string
  try {
    // Authenticate the request
    const session = await auth();
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // Check if session exists
    const existingSession = await getSessionById(id, userId);
    if (!existingSession) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Update the session
    const updatedSession = await updateSession(id, userId, {
      endAt: body.endAt ? new Date(body.endAt) : undefined,
      actualMins: body.actualMins,
      notes: body.notes,
    });

    // Calculate derived fields
    const duration = calculateSessionDuration(updatedSession.startAt, updatedSession.endAt);
    const effectiveness = calculateEffectiveness(updatedSession.plannedMins, updatedSession.actualMins);

    return new Response(
      JSON.stringify({
        ...updatedSession,
        duration,
        effectiveness,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/sessions/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  // In Next.js dynamic routes, the id parameter is guaranteed to be present
  // Type assertion since we know it will always be a string
  try {
    // Authenticate the request
    const session = await auth();
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user.id;

    // Check if session exists
    const existingSession = await getSessionById(id, userId);
    if (!existingSession) {
      return new Response(
        JSON.stringify({ error: 'Not found', details: 'The requested resource could not be found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete the session
    const success = await deleteSession(id, userId);

    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: 'Internal server error', 
          details: 'Failed to delete session' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}