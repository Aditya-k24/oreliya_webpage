#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Supabase migration...')
  
  try {
    // Test database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Check if we can query the database
    const userCount = await prisma.user.count()
    console.log(`📊 Found ${userCount} users in the database`)
    
    const productCount = await prisma.product.count()
    console.log(`📦 Found ${productCount} products in the database`)
    
    console.log('✅ Database migration verification complete!')
    
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Migration script failed:', e)
    process.exit(1)
  })
