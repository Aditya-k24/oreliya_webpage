export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

// Create Prisma client with proper configuration for production
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📝 Registration request:', body);
    
    // Basic validation
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: email, password, firstName, lastName',
      }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: body.email },
    });
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
      }, { status: 409 });
    }
    
    // Get user role
    const userRole = await prisma.roles.findUnique({
      where: { name: 'user' },
    });
    
    if (!userRole) {
      return NextResponse.json({
        success: false,
        message: 'Default user role not found',
      }, { status: 500 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Create user
    const user = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || null,
        roleId: userRole.id,
        updatedAt: new Date(),
      },
      include: { roles: true },
    });
    
    console.log('✅ User created:', user.email);
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.roles.name,
        },
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
