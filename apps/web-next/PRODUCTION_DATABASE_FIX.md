# 🚨 PRODUCTION DATABASE CONNECTION FIX

## Current Issue
Production deployment can't connect to Supabase database:
```
Can't reach database server at `db.zsexkmraqccjxtwsksao.supabase.co:6543`
```

## ✅ SOLUTION IMPLEMENTED

### 1. Fixed API Runtime Configuration
Added `export const runtime = 'nodejs';` to all API routes that use Prisma:
- `/api/auth/[...nextauth]/route.ts`
- `/api/auth/signup/route.ts` 
- `/api/health/route.ts`
- `/api/products/route.ts`

### 2. Verified Working Connection Strings
All these connection strings work locally:
- **Pooled**: `postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true`
- **Pooled with SSL**: `postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require`
- **Direct**: `postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:5432/postgres`

## 🎯 RECOMMENDED PRODUCTION CONFIGURATION

### Vercel Environment Variable
Update your `DATABASE_URL` in Vercel to:
```
DATABASE_URL=postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

### Vercel CLI Command
```bash
vercel env add DATABASE_URL "postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
```

## 🔧 TROUBLESHOOTING STEPS

### 1. Check Supabase Project Status
1. Go to https://supabase.com/dashboard
2. Find project: `zsexkmraqccjxtwsksao`
3. **If paused → Click "Resume"**
4. Wait 2-3 minutes for database to come online

### 2. Update Vercel Environment Variable
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `DATABASE_URL` with the recommended value above
5. **Save** changes

### 3. Redeploy Application
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Wait for deployment to complete

### 4. Test Admin Login
1. Go to your production site
2. Try admin login:
   - Email: `admin@oreliya.com`
   - Password: `admin123`

## 🧪 LOCAL TESTING

Test the connection locally:
```bash
cd apps/web-next
npx tsx scripts/test-supabase-connection.ts
```

## 📋 WHAT WAS FIXED

1. **API Runtime**: Added `runtime = 'nodejs'` to all Prisma API routes
2. **Connection Pooling**: Verified working connection strings
3. **SSL Configuration**: Added SSL mode for production
4. **Connection Limits**: Added connection limit for serverless

## 🎉 EXPECTED RESULT

After updating the Vercel environment variable and redeploying:
- ✅ Admin login should work
- ✅ No more "Can't reach database server" errors
- ✅ All API routes should connect to database successfully

## 🆘 IF STILL FAILING

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify Project Not Paused**: Supabase dashboard
3. **Try Alternative Connection**: Use port 5432 instead of 6543
4. **Contact Support**: Supabase support if issue persists
