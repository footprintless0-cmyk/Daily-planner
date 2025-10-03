import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Authenticate the request
    const session = await auth();
    
    return new Response(
      JSON.stringify({ 
        session: session ? 'Authenticated' : 'Not authenticated',
        user: session?.user || null,
        env: {
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NEXTAUTH_REDIRECT_PROXY_URL: process.env.NEXTAUTH_REDIRECT_PROXY_URL,
          CODESPACE_URL: process.env.CODESPACE_URL,
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking auth status:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}