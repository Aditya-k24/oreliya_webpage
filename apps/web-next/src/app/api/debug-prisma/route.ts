export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/api-lib/config/database';

export async function GET(request: NextRequest) {
  try {
    // Check Prisma client status
    const prismaStatus = {
      isDefined: !!prisma,
      hasProduct: typeof prisma?.product !== 'undefined',
      availableModels: prisma ? Object.keys(prisma).filter(key => !key.startsWith('$')) : [],
      environment: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    };

    // Try a simple query if Prisma is available
    let queryResult = null;
    if (prisma && prisma.product) {
      try {
        queryResult = await prisma.product.count();
      } catch (error) {
        queryResult = { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    return NextResponse.json({
      success: true,
      prisma: prismaStatus,
      query: queryResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
