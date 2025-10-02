# 🚨 PRODUCTION DATABASE TROUBLESHOOTING

## Current Issue
Production still can't connect to Supabase database despite:
- ✅ Hardcoded DATABASE_URL in schema
- ✅ Node.js runtime for all API routes
- ✅ Direct connection (port 5432) with SSL
- ✅ Local testing works perfectly

## 🔍 DIAGNOSTIC STEPS

### 1. Check Supabase Project Status
**CRITICAL**: This is the most likely cause!

1. Go to https://supabase.com/dashboard
2. Login with your Supabase account
3. Find project: `zsexkmraqccjxtwsksao`
4. **Check if project shows "Paused"**
5. **If paused → Click "Resume"**
6. Wait 2-3 minutes for database to come online

### 2. Verify Database Credentials
1. In Supabase dashboard, go to **Settings** → **Database**
2. Check the connection string matches:
   ```
   postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:5432/postgres
   ```

### 3. Check Supabase Status Page
1. Go to https://status.supabase.com
2. Look for any ongoing incidents
3. Check if there are regional issues

### 4. Test Connection from External Tool
Use a database client to test connection:
- **TablePlus**: https://tableplus.com
- **DBeaver**: https://dbeaver.io
- **pgAdmin**: https://pgadmin.org

Connection details:
- Host: `db.zsexkmraqccjxtwsksao.supabase.co`
- Port: `5432`
- Database: `postgres`
- Username: `postgres`
- Password: `Kulkarni@24042002`

### 5. Check Vercel Function Logs
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Functions** tab
4. Check logs for detailed error messages
5. Look for network timeouts or connection refused errors

## 🔧 ALTERNATIVE SOLUTIONS

### Option 1: Try Different Connection String
If direct connection fails, try pooled connection:
```
postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### Option 2: Add Connection Pooling
Update schema.prisma:
```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require&connect_timeout=300"
}
```

### Option 3: Use Environment Variable
Revert to environment variable approach:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then set in Vercel:
```
DATABASE_URL=postgresql://postgres:Kulkarni@24042002@db.zsexkmraqccjxtwsksao.supabase.co:5432/postgres?sslmode=require&connect_timeout=300
```

## 🎯 MOST LIKELY SOLUTION

**The Supabase project is probably paused!**

1. **Go to Supabase Dashboard**
2. **Find project `zsexkmraqccjxtwsksao`**
3. **If it shows "Paused" → Click "Resume"**
4. **Wait 2-3 minutes**
5. **Test admin login again**

## 📞 IF STILL FAILING

1. **Contact Supabase Support**: https://supabase.com/support
2. **Check Vercel Support**: https://vercel.com/help
3. **Verify Network Connectivity**: Test from different networks
4. **Try Different Region**: Create new Supabase project in different region

## 🧪 TESTING COMMANDS

Test locally:
```bash
cd apps/web-next
npx tsx scripts/diagnose-production-db.ts
```

Test connection string:
```bash
npx tsx scripts/test-supabase-connection.ts
```

## 📋 CHECKLIST

- [ ] Supabase project not paused
- [ ] Database credentials correct
- [ ] No Supabase incidents
- [ ] External tool can connect
- [ ] Vercel function logs checked
- [ ] Alternative connection strings tried
- [ ] Environment variable approach tried
- [ ] Support contacted if needed

## 🎉 EXPECTED RESULT

After resolving the issue:
- ✅ Admin login works: `admin@oreliya.com` / `admin123`
- ✅ No more "Can't reach database server" errors
- ✅ All API routes connect successfully
- ✅ Production database operations work
