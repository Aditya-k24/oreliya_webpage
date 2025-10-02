// Remove the import - AuthOptions is not exported in newer versions
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AppUser, AppToken, AppSession } from '../types/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Create Prisma client instance with proper configuration for production
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

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
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { role: true },
          });

          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            console.log('User account is inactive:', credentials.email);
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          console.log('Authentication successful for user:', user.email, 'Role:', user.role.name);

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role.name,
            accessToken: `db-${user.id}-token`,
            refreshToken: `db-${user.id}-refresh-token`,
          } as AppUser & { accessToken: string; refreshToken: string };

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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
