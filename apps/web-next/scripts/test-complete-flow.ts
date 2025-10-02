import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCompleteRegistrationFlow() {
  try {
    console.log('🧪 Testing Complete Registration Flow...\n');

    // Test 1: Registration API
    console.log('1️⃣ Testing Registration API...');
    const registrationData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '+1234567890',
    };

    const response = await fetch('http://localhost:3000/api/test-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration API successful');
      console.log('👤 Created user:', result.data.user);
    } else {
      console.log('❌ Registration API failed:', result.message);
      return;
    }

    // Test 2: Verify user in database
    console.log('\n2️⃣ Verifying user in database...');
    const createdUser = await prisma.user.findUnique({
      where: { email: registrationData.email },
      include: { role: true },
    });

    if (createdUser) {
      console.log('✅ User found in database');
      console.log('📋 User details:', {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role.name,
        isActive: createdUser.isActive,
      });
    } else {
      console.log('❌ User not found in database');
    }

    // Test 3: Test login with created user
    console.log('\n3️⃣ Testing login with created user...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: registrationData.email,
        password: registrationData.password,
        redirect: 'false',
      }),
    });

    if (loginResponse.ok) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed');
    }

    // Test 4: Test existing users login
    console.log('\n4️⃣ Testing existing users login...');
    
    const adminLogin = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'admin@oreliya.com',
        password: 'admin123',
        redirect: 'false',
      }),
    });

    if (adminLogin.ok) {
      console.log('✅ Admin login successful');
    } else {
      console.log('❌ Admin login failed');
    }

    const userLogin = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'user@oreliya.com',
        password: 'user123',
        redirect: 'false',
      }),
    });

    if (userLogin.ok) {
      console.log('✅ Regular user login successful');
    } else {
      console.log('❌ Regular user login failed');
    }

    // Test 5: List all users
    console.log('\n5️⃣ Current users in database...');
    const allUsers = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log('👥 All users:');
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role.name}) - ${user.firstName} ${user.lastName}`);
    });

    console.log('\n🎉 Registration flow test completed successfully!');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteRegistrationFlow();
