import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import type { JWT } from 'next-auth/jwt';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

type AppUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

type AppToken = JWT & {
  user?: AppUser;
  accessToken?: string;
  refreshToken?: string;
};

type AppSession = Session & {
  user?: AppUser;
  accessToken?: string;
  refreshToken?: string;
};

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
          const res = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          const data = res.data as {
            success?: boolean;
            data?: {
              user: {
                id: string;
                email: string;
                firstName?: string;
                lastName?: string;
                role?: string;
              };
              tokens: { accessToken: string; refreshToken: string };
            };
          };
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
            } as unknown as AppUser & {
              accessToken: string;
              refreshToken: string;
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
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
      if (trigger === 'update' && session) {
        const s = session as AppSession;
        nextToken = {
          ...nextToken,
          user: { ...nextToken.user, ...s.user },
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
      return nextSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
