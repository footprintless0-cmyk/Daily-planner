import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.vercel-insights.com"
  );
  
  // Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Permissions-Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}

// See "Matching Paths" to learn more: https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-data' },
        { type: 'header', key: 'next-action' },
      ],
    },
  ],
};