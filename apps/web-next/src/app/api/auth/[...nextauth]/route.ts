import NextAuth from 'next-auth';
import { authOptions } from '@/features/auth/lib/options';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

const handler = (NextAuth as any)(authOptions);

export { handler as GET, handler as POST };
