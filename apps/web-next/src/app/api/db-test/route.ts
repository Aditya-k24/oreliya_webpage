import { NextResponse } from 'next/server';
import prisma from '@/api-lib/config/database';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET() {
  try {
    const userCount = await prisma.users.count();
    const productCount = await prisma.products.count();
    const orderCount = await prisma.orders.count();

    return NextResponse.json({
      message: 'Database connection successful',
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


