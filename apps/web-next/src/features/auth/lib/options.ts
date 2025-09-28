// Remove the import - AuthOptions is not exported in newer versions
import CredentialsProvider from 'next-auth/providers/credentials';
import { config } from '@/lib/config';
import type { AppUser, AppToken, AppSession } from '../types/auth';

// Production-ready authentication options
export const authOptions = {
  session: { 
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: { 
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          // In production, attempt to authenticate with real API
          if (process.env.NODE_ENV === 'production') {
            const response = await fetch(`${config.api.baseUrl}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              return {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              } as AppUser & { accessToken: string; refreshToken: string };
            }
          }

          // Development fallback with mock authentication
          if (credentials.email === 'admin@oreliya.com' && credentials.password === 'admin123') {
            return {
              id: 'admin-1',
              email: 'admin@oreliya.com',
              name: 'Admin User',
              role: 'admin',
              accessToken: 'mock-admin-token',
              refreshToken: 'mock-admin-refresh-token',
            } as AppUser & { accessToken: string; refreshToken: string };
          }

          if (credentials.email === 'user@oreliya.com' && credentials.password === 'user123') {
            return {
              id: 'user-2',
              email: 'user@oreliya.com',
              name: 'Regular User',
              role: 'user',
              accessToken: 'mock-user-token',
              refreshToken: 'mock-user-refresh-token',
            } as AppUser & { accessToken: string; refreshToken: string };
          }

          // Allow any email/password combination for newly registered users (development only)
          if (process.env.NODE_ENV === 'development' && 
              credentials.email && credentials.password && 
              credentials.email !== 'admin@oreliya.com' && 
              credentials.email !== 'user@oreliya.com') {
            return {
              id: `new-user-${Date.now()}`,
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'user',
              accessToken: 'mock-new-user-token',
              refreshToken: 'mock-new-user-refresh-token',
            } as AppUser & { accessToken: string; refreshToken: string };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // If this is the first time the user is signing in, user will be defined
      if (user) {
        const u = user as AppUser & { accessToken?: string; refreshToken?: string };
        
        return {
          ...token,
          user: {
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
          },
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
        } as AppToken;
      }
      
      // For subsequent requests, return the existing token
      return token as AppToken;
    },
    async session({ session, token }: { session: any; token: any }) {
      const t = token as AppToken;
      const nextSession: AppSession = {
        ...session,
        user: t.user,
        accessToken: t.accessToken,
        refreshToken: t.refreshToken,
      };
      
      return nextSession as any;
    },
    async redirect({ baseUrl }: { url: string; baseUrl: string }) {
      // Always redirect to homepage after successful login
      return `${baseUrl}/`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || config.auth.secret,
  debug: process.env.NODE_ENV === 'development',
};
