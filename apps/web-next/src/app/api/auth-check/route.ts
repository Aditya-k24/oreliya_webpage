export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        user: null
      });
    }

    const userRole = (session as any)?.user?.role;
    const userEmail = (session as any)?.user?.email;
    const userId = (session as any)?.user?.id;

    return NextResponse.json({
      success: true,
      message: 'User authenticated',
      user: {
        id: userId,
        email: userEmail,
        role: userRole,
        isAdmin: userRole === 'admin',
        sessionData: session
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error checking authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
