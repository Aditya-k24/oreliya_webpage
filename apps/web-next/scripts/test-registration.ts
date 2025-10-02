import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRegistration() {
  try {
    console.log('🧪 Testing Registration API...');

    // Test data
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'testpassword123',
      phone: '+1234567890',
    };

    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/auth-api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('✅ Registration API test passed!');
      
      // Verify user was created in database
      const createdUser = await prisma.user.findUnique({
        where: { email: testUser.email },
        include: { role: true },
      });

      if (createdUser) {
        console.log('✅ User created in database successfully!');
        console.log('👤 User details:', {
          id: createdUser.id,
          email: createdUser.email,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          role: createdUser.role.name,
        });
      } else {
        console.log('❌ User not found in database');
      }
    } else {
      console.log('❌ Registration API test failed');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();
