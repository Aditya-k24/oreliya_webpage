import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('🚀 Creating users in database...');

    // First, create roles if they don't exist
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Administrator with full access',
      },
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: {
        name: 'user',
        description: 'Regular user with limited access',
      },
    });

    console.log('✅ Roles created/verified');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@oreliya.com' },
      update: {},
      create: {
        email: 'admin@oreliya.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        isActive: true,
        emailVerified: true,
        roleId: adminRole.id,
      },
    });

    // Create regular user
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@oreliya.com' },
      update: {},
      create: {
        email: 'user@oreliya.com',
        password: userPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567891',
        isActive: true,
        emailVerified: true,
        roleId: userRole.id,
      },
    });

    console.log('✅ Users created successfully!');
    console.log('📧 Admin User:', adminUser.email, '(Role: admin)');
    console.log('📧 Regular User:', regularUser.email, '(Role: user)');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('Admin: admin@oreliya.com / admin123');
    console.log('User: user@oreliya.com / user123');

  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
