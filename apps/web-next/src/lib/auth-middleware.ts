import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: { requireRole?: string[] } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      const userRole = (session as any)?.user?.role;
      
      // Check role requirements
      if (options.requireRole && !options.requireRole.includes(userRole)) {
        return NextResponse.json(
          { success: false, message: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = {
        id: (session as any)?.user?.id,
        email: (session as any)?.user?.email,
        role: userRole,
      };

      return await handler(authenticatedReq);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

export async function withOptionalAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const session = await getServerSession(authOptions);
      
      const authenticatedReq = req as AuthenticatedRequest;
      if (session) {
        authenticatedReq.user = {
          id: (session as any)?.user?.id,
          email: (session as any)?.user?.email,
          role: (session as any)?.user?.role,
        };
      }

      return await handler(authenticatedReq);
    } catch (error) {
      console.error('Optional auth error:', error);
      return await handler(req as AuthenticatedRequest);
    }
  };
}
