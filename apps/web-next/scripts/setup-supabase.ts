#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

console.log('🚀 Supabase Migration Setup Script')
console.log('=====================================\n')

// Check if .env.local exists
const envPath = join(process.cwd(), '.env.local')
const envExists = existsSync(envPath)

if (!envExists) {
  console.log('📝 Creating .env.local file...')
  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Existing configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXTAUTH_SECRET=your_nextauth_secret
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
`
  writeFileSync(envPath, envTemplate)
  console.log('✅ Created .env.local file')
} else {
  console.log('📄 .env.local file already exists')
}

console.log('\n📋 Next Steps:')
console.log('1. Go to https://supabase.com and create a new project')
console.log('2. Get your project credentials from Settings > API')
console.log('3. Update the .env.local file with your Supabase credentials')
console.log('4. Create storage bucket: "production"')
console.log('5. Run: pnpm supabase:test')
console.log('6. Run: pnpm supabase:migrate-images (if you have existing images)')
console.log('\n📚 See SUPABASE_MIGRATION.md for detailed instructions')

console.log('\n🔧 Available Commands:')
console.log('- pnpm supabase:test - Test database connection')
console.log('- pnpm supabase:migrate-images - Migrate existing images')
console.log('- pnpm db:push - Push schema to Supabase')
console.log('- pnpm db:migrate:deploy - Deploy migrations to Supabase')

console.log('\n✨ Setup complete! Follow the next steps above.')
