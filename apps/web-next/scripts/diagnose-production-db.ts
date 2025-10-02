#!/usr/bin/env tsx

/**
 * Production Database Connection Diagnostic Script
 * This script helps diagnose why production can't connect to Supabase
 */

import { PrismaClient } from '@prisma/client';

async function testProductionConnection() {
  console.log('🔍 Production Database Connection Diagnostic');
  console.log('==========================================\n');

  // Test the current hardcoded connection
  const connectionString = "postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:5432/postgres?sslmode=require&connect_timeout=300";
  
  console.log('Testing connection string:');
  console.log(connectionString.replace(/:[^:@]+@/, ':***@'));
  console.log('');

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
      log: ['error', 'warn', 'info'],
    });

    console.log('🔄 Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connection successful!');

    console.log('🔄 Testing basic query...');
    const userCount = await prisma.users.count();
    console.log(`✅ Query successful - Users: ${userCount}`);

    console.log('🔄 Testing admin user lookup...');
    const adminUser = await prisma.users.findFirst({
      where: { email: 'admin@oreliya.com' },
      include: { roles: true }
    });
    
    if (adminUser) {
      console.log(`✅ Admin user found - Role: ${adminUser.roles?.name || 'No role'}`);
    } else {
      console.log('⚠️  Admin user not found');
    }

    await prisma.$disconnect();
    console.log('\n🎉 All tests passed! Database connection is working.');
    
  } catch (error) {
    console.log('\n❌ Connection failed!');
    console.log('Error details:');
    console.log('Type:', error.constructor.name);
    console.log('Message:', error.message);
    
    if (error.code) {
      console.log('Error Code:', error.code);
    }
    
    if (error.meta) {
      console.log('Meta:', error.meta);
    }

    console.log('\n🔧 Troubleshooting suggestions:');
    console.log('1. Check if Supabase project is paused');
    console.log('2. Verify database credentials are correct');
    console.log('3. Check network connectivity from production environment');
    console.log('4. Try different connection string formats');
    console.log('5. Contact Supabase support if issue persists');
  }
}

async function main() {
  await testProductionConnection();
}

main().catch(console.error);
