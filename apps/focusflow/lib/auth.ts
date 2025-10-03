import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { JWTOptions } from 'next-auth/jwt';
import { SessionOptions } from 'next-auth';

// Add other providers as needed (Google, GitHub, etc.)

// For now, using credentials provider for development
// In production, consider using OAuth providers for better security

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // This is a placeholder implementation
        // In a real application, you would verify credentials against your database
        if (credentials?.email) {
          // Mock user - replace with real database lookup
          return {
            id: '1',
            email: credentials.email,
            name: 'Test User'
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  } as SessionOptions,
  jwt: {
    // Set to true for increased security
    maxAge: 30 * 24 * 60 * 60, // 30 days
  } as JWTOptions,
  // Security settings
  trustHost: true, // Only allow connections from trusted hosts
  // Add additional security measures
  events: {
    // Add event handling for security logging if needed
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      }
    },
    // Other cookie configurations for enhanced security...
  }
});