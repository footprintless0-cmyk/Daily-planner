import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { applyUserTemplate } from '@/lib/users';

// POST /api/user/templates
export async function POST(req: NextRequest) {
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

    // Parse the request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.templateName) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: 'templateName is required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Apply the template
    const result = await applyUserTemplate(userId, body.templateName);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error applying template:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}