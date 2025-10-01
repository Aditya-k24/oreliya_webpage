import { NextResponse } from 'next/server';
import { prisma } from '@/api-lib/prisma';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();

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


