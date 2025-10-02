import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/api-lib/config/database';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET(_request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Test basic query
    const userCount = await prisma.users.count();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      userCount,
      environment: process.env.NODE_ENV,
    }, { status: 200 });
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
    }, { status: 500 });
  }
}