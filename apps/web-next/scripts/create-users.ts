#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function createUsers() {
  console.log('🚀 Creating admin and dummy users...')
  
  try {
    // First, create roles if they don't exist
    console.log('📋 Creating roles...')
    
    const adminRole = await prisma.roles.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        id: randomUUID(),
        name: 'admin',
        description: 'Administrator with full access',
        updatedAt: new Date()
      }
    })
    
    const userRole = await prisma.roles.upsert({
      where: { name: 'user' },
      update: {},
      create: {
        id: randomUUID(),
        name: 'user',
        description: 'Regular user with limited access',
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Roles created:', { admin: adminRole.name, user: userRole.name })
    
    // Create admin user
    console.log('👑 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    
    const adminUser = await prisma.users.upsert({
      where: { email: 'admin@oreliya.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'admin@oreliya.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        isActive: true,
        emailVerified: true,
        roleId: adminRole.id,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Admin user created:', {
      email: adminUser.email,
      name: `${adminUser.firstName} ${adminUser.lastName}`,
      role: 'admin'
    })
    
    // Create dummy user
    console.log('👤 Creating dummy user...')
    const userPassword = await bcrypt.hash('user123', 10)
    
    const dummyUser = await prisma.users.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'user@example.com',
        password: userPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567891',
        isActive: true,
        emailVerified: true,
        roleId: userRole.id,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Dummy user created:', {
      email: dummyUser.email,
      name: `${dummyUser.firstName} ${dummyUser.lastName}`,
      role: 'user'
    })
    
    // Create addresses for the dummy user
    console.log('🏠 Creating addresses for dummy user...')
    
    await prisma.addresses.createMany({
      data: [
        {
          id: randomUUID(),
          userId: dummyUser.id,
          type: 'billing',
          firstName: 'John',
          lastName: 'Doe',
          addressLine1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
          phone: '+1234567891',
          isDefault: true,
          updatedAt: new Date()
        },
        {
          id: randomUUID(),
          userId: dummyUser.id,
          type: 'shipping',
          firstName: 'John',
          lastName: 'Doe',
          addressLine1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
          phone: '+1234567891',
          isDefault: true,
          updatedAt: new Date()
        }
      ],
      skipDuplicates: true
    })
    
    console.log('✅ Addresses created for dummy user')
    
    // Create a cart for the dummy user
    console.log('🛒 Creating cart for dummy user...')
    
    await prisma.carts.upsert({
      where: { userId: dummyUser.id },
      update: {},
      create: {
        id: randomUUID(),
        userId: dummyUser.id,
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Cart created for dummy user')
    
    console.log('\n🎉 Users created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('👑 Admin:')
    console.log('   Email: admin@oreliya.com')
    console.log('   Password: admin123')
    console.log('\n👤 User:')
    console.log('   Email: user@example.com')
    console.log('   Password: user123')
    
  } catch (error) {
    console.error('❌ Error creating users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUsers()
  .catch((e) => {
    console.error('❌ Script failed:', e)
    process.exit(1)
  })