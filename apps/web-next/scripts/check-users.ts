#!/usr/bin/env tsx

import prisma from '../src/api-lib/config/database'

async function checkUsers() {
  console.log('🔍 Checking if admin user exists in database...')
  
  try {
    // Check if admin user exists
    const adminUser = await prisma.users.findUnique({
      where: { email: 'admin@oreliya.com' },
      include: { roles: true }
    })
    
    if (adminUser) {
      console.log('✅ Admin user found:', {
        email: adminUser.email,
        name: `${adminUser.firstName} ${adminUser.lastName}`,
        role: adminUser.roles?.name,
        isActive: adminUser.isActive
      })
    } else {
      console.log('❌ Admin user NOT found')
    }
    
    // Check total user count
    const userCount = await prisma.users.count()
    console.log(`📊 Total users in database: ${userCount}`)
    
    // List all users
    const allUsers = await prisma.users.findMany({
      include: { roles: true },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        roles: { select: { name: true } }
      }
    })
    
    console.log('👥 All users in database:')
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.roles?.name} - Active: ${user.isActive}`)
    })
    
  } catch (error) {
    console.error('❌ Error checking users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
  .catch((e) => {
    console.error('❌ Script failed:', e)
    process.exit(1)
  })
