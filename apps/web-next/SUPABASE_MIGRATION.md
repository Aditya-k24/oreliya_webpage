# Supabase Migration Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to be created

## Step 2: Get Supabase Credentials

From your Supabase dashboard:

1. **Project URL**: Go to Settings > API > Project URL
2. **Anon Key**: Go to Settings > API > Project API keys > anon public
3. **Service Role Key**: Go to Settings > API > Project API keys > service_role secret

## Step 3: Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Step 4: Create Storage Bucket

In your Supabase dashboard:

1. Go to Storage
2. Create one bucket named `production`
3. Set the bucket to public
4. Configure RLS policies if needed

## Step 5: Database Migration

Run these commands to migrate your database:

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to Supabase
pnpm db:push

# Or run migrations
pnpm db:migrate:deploy
```

## Step 6: Test the Setup

1. Start your development server
2. Test image uploads through the API
3. Verify images appear in Supabase Storage
4. Check that database operations work correctly

## API Endpoints

- `POST /api/upload` - Upload to products folder (default)
- `POST /api/upload/customize` - Upload to customize folder
- `POST /api/upload?folder=customize` - Upload to customize folder

## Storage Structure

```
production/
├── products/
│   ├── product-images/
│   └── category-images/
└── customize/
    ├── engraving-images/
    ├── customization-previews/
    └── user-uploads/
```
