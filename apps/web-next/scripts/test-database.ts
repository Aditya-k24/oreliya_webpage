import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test role query
    const roles = await prisma.role.findMany();
    console.log('📋 Available roles:', roles.map(r => r.name));
    
    // Test user query
    const users = await prisma.user.findMany({
      include: { role: true },
      take: 5,
    });
    console.log('👥 Existing users:', users.map(u => ({ email: u.email, role: u.role.name })));
    
    // Test creating a user
    console.log('🧪 Testing user creation...');
    
    const userRole = await prisma.role.findUnique({
      where: { name: 'user' },
    });
    
    if (!userRole) {
      console.log('❌ User role not found');
      return;
    }
    
    const testUser = await prisma.user.create({
      data: {
        email: 'testuser2@example.com',
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User2',
        phone: '+1234567890',
        roleId: userRole.id,
      },
      include: { role: true },
    });
    
    console.log('✅ Test user created:', {
      id: testUser.id,
      email: testUser.email,
      role: testUser.role.name,
    });
    
    // Clean up
    await prisma.user.delete({
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
