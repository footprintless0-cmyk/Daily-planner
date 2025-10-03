// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Specify which routes require authentication
export async function middleware(req: NextRequest) {
  // Skip authentication in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Define routes that require authentication
  const protectedPaths = [
    /^\/api\/(?!auth\/)/, // All API routes except auth-related ones
    /^\/dashboard/,       // Dashboard routes
    /^\/settings/,        // Settings routes
    /^\/focus/,          // Focus room
    /^\/kanban/,         // Kanban board
    /^\/calendar/,       // Calendar view
    /^\/list/            // Task list
  ];

  const isProtected = protectedPaths.some(path => path.test(req.nextUrl.pathname));

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      // Redirect to login page
      const url = req.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.search = `callbackUrl=${req.nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // Add CSRF protection for mutating requests
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH') {
    // In a real implementation, you might want to validate a CSRF token
    // For now, we're just adding security headers
    const response = NextResponse.next();
    
    // Additional security headers for mutating requests
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }

  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (public authentication pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!auth|_next/static|_next/image|favicon.ico).*)',
  ],
};