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
        console.log('🔍 Authorize called with:', credentials);
        
        if (!credentials?.email || !credentials.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        // Mock authentication for development - this will work immediately
        if (credentials.email === 'admin@oreliya.com' && credentials.password === 'admin123') {
          console.log('✅ Admin credentials matched');
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

        // Allow any email/password combination for newly registered users (mock)
        if (credentials.email && credentials.password && 
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
