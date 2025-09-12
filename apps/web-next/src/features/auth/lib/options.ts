import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { config } from '@/lib/config';
import type { AppUser, AppToken, AppSession } from '../types/auth';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const response = await fetch(`${config.api.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (data?.success && data?.data?.user && data?.data?.tokens) {
            const { user, tokens } = data.data;
            const name =
              `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
              undefined;

            return {
              id: user.id,
              email: user.email,
              name,
              role: user.role,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            } as AppUser & { accessToken: string; refreshToken: string };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as AppToken;
      const u = user as
        | (AppUser & { accessToken?: string; refreshToken?: string })
        | undefined;

      let nextToken: AppToken = { ...t };
      if (u) {
        nextToken = {
          ...nextToken,
          user: { id: u.id, email: u.email, name: u.name, role: u.role },
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
        };
      }
      return nextToken;
    },
    async session({ session, token }) {
      const t = token as AppToken;
      const s = session as AppSession;
      const nextSession: AppSession = {
        ...s,
        user: t.user,
        accessToken: t.accessToken,
        refreshToken: t.refreshToken,
      };
      return nextSession as any;
    },
  },
  secret: config.auth.secret,
};
