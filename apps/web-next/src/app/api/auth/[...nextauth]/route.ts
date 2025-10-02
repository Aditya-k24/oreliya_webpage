import NextAuth from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
