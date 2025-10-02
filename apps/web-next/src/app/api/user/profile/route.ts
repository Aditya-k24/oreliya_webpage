export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';

async function handleUserProfile(req: NextRequest) {
  try {
    const { method } = req;
    
    switch (method) {
      case 'GET':
        return await handleGetProfile(req);
      case 'PUT':
        return await handleUpdateProfile(req);
      default:
        return NextResponse.json(
          { success: false, message: 'Method not allowed' },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleGetProfile(req: NextRequest) {
  const user = (req as any).user;
  
  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  });
}

async function handleUpdateProfile(req: NextRequest) {
  const user = (req as any).user;
  const body = await req.json();
  
  // TODO: Implement database user profile update
  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      ...body,
      updatedAt: new Date().toISOString(),
    },
    message: 'Profile updated successfully'
  });
}

// Export with authentication (any authenticated user)
export const GET = withAuth(handleUserProfile);
export const PUT = withAuth(handleUserProfile);