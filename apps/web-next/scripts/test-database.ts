import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test roles query
    const roles = await prisma.roles.findMany();
    console.log('📋 Available roles:', roles.map(r => r.name));
    
    // Test users query
    const users = await prisma.users.findMany({
      include: { roles: true },
      take: 5,
    });
    console.log('👥 Existing users:', users.map(u => ({ email: u.email, role: u.roles.name })));
    
    // Test creating a user
    console.log('🧪 Testing user creation...');
    
    const userRole = await prisma.roles.findUnique({
      where: { name: 'user' },
    });
    
    if (!userRole) {
      console.log('❌ User role not found');
      return;
    }
    
    const testUser = await prisma.users.create({
      data: {
        id: randomUUID(),
        email: 'testuser2@example.com',
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User2',
        phone: '+1234567890',
        roleId: userRole.id,
        updatedAt: new Date(),
      },
      include: { roles: true },
    });
    
    console.log('✅ Test user created:', {
      id: testUser.id,
      email: testUser.email,
      role: testUser.roles.name,
    });
    
    // Clean up
    await prisma.users.delete({
      where: { id: testUser.id },
    });
    console.log('🧹 Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Database test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
