#!/usr/bin/env tsx

/**
 * Test Supabase database connection with different configurations
 * This script tests various connection string formats to find what works
 */

import { PrismaClient } from '@prisma/client';

// Test different connection string configurations
const connectionConfigs = [
  {
    name: 'Current Pooled Connection',
    url: 'postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true'
  },
  {
    name: 'Pooled with SSL and Connection Limit',
    url: 'postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require'
  },
  {
    name: 'Direct Connection (Port 5432)',
    url: 'postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:5432/postgres'
  },
  {
    name: 'Direct with SSL',
    url: 'postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:5432/postgres?sslmode=require'
  },
  {
    name: 'Pooled with Extended Parameters',
    url: 'postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require&connect_timeout=30'
  }
];

async function testConnection(config: { name: string; url: string }) {
  console.log(`\n🔍 Testing: ${config.name}`);
  console.log(`URL: ${config.url.replace(/:[^:@]+@/, ':***@')}`);
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.url,
        },
      },
      log: ['error'],
    });

    // Test connection
    await prisma.$connect();
    console.log('✅ Connection successful');

    // Test query
    const userCount = await prisma.users.count();
    console.log(`✅ Query successful - Users: ${userCount}`);

    // Test admin user exists
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
    return { success: true, config };
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return { success: false, config, error: error.message };
  }
}

async function main() {
  console.log('🚀 Testing Supabase database connections...\n');
  console.log('Project: zsexkmraqccjxtwsksao.supabase.co');
  console.log('Testing various connection configurations...\n');

  const results = [];
  
  for (const config of connectionConfigs) {
    const result = await testConnection(config);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 RESULTS SUMMARY:');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  if (successful.length > 0) {
    console.log('\n✅ WORKING CONNECTIONS:');
    successful.forEach(result => {
      console.log(`- ${result.config.name}`);
      console.log(`  URL: ${result.config.url.replace(/:[^:@]+@/, ':***@')}`);
    });

    console.log('\n🎯 RECOMMENDED FOR PRODUCTION:');
    const recommended = successful[0];
    console.log(`DATABASE_URL=${recommended.config.url}`);
    
    console.log('\n📋 VERCEL COMMAND:');
    console.log(`vercel env add DATABASE_URL "${recommended.config.url}"`);
  }

  if (failed.length > 0) {
    console.log('\n❌ FAILED CONNECTIONS:');
    failed.forEach(result => {
      console.log(`- ${result.config.name}: ${result.error}`);
    });
  }

  if (successful.length === 0) {
    console.log('\n🚨 NO WORKING CONNECTIONS FOUND!');
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Check if Supabase project is paused');
    console.log('2. Verify database credentials');
    console.log('3. Check network connectivity');
    console.log('4. Contact Supabase support');
  }
}

main().catch(console.error);
