# Production Deployment Guide

This comprehensive guide covers deploying the Oreliya web application to production with all necessary configurations and optimizations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Domain name and SSL certificate
- Environment variables configured

### 1. Environment Variables

Create a `.env.production` file with these **REQUIRED** variables:

```bash
# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secure-production-secret-key-min-32-chars

# API Configuration (REQUIRED)
API_BASE_URL=https://yourdomain.com/api

# Email Configuration (REQUIRED)
RESEND_API_KEY=re_your_resend_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Security
CORS_ORIGIN=https://yourdomain.com

# Database (when implemented)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### 2. Production Build

```bash
# Install dependencies
pnpm install

# Run production build
pnpm run build:production

# Test production build locally
pnpm run start:production
```

## 🔧 Platform-Specific Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required env vars in Vercel dashboard
3. **Configure Build Settings**:
   - Build Command: `pnpm run build:production`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
4. **Deploy**: Push to main branch triggers automatic deployment

### Netlify

1. **Connect Repository**: Link your GitHub repository
2. **Build Settings**:
   - Build Command: `pnpm run build:production`
   - Publish Directory: `.next`
   - Install Command: `pnpm install`
3. **Environment Variables**: Add in Netlify dashboard
4. **Deploy**: Automatic on push to main

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm
RUN pnpm run build:production

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t oreliya-web .
docker run -p 3000:3000 --env-file .env.production oreliya-web
```

## 🔒 Security Checklist

- [ ] **HTTPS Enabled**: SSL certificate installed and configured
- [ ] **Environment Variables**: All secrets properly configured
- [ ] **CORS**: Configured for your domain only
- [ ] **Rate Limiting**: Enabled (100 requests/15 minutes)
- [ ] **Security Headers**: CSP, HSTS, X-Frame-Options enabled
- [ ] **File Upload**: Size and type restrictions in place
- [ ] **Authentication**: NextAuth properly configured
- [ ] **Database**: Connection secured with SSL

## 📊 Monitoring & Analytics

### Health Check
Monitor your application health:
```bash
curl https://yourdomain.com/api/health
```

### Error Tracking
- Built-in error boundary catches React errors
- API errors logged with structured logging
- Health check endpoint for monitoring

### Performance
- Next.js automatic optimizations enabled
- Image optimization configured
- Static generation where possible

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**: Check all environment variables are set
2. **Authentication Issues**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL
3. **File Upload Issues**: Check MAX_FILE_SIZE and ALLOWED_FILE_TYPES
4. **Email Issues**: Verify RESEND_API_KEY is valid

### Debug Mode
Enable debug mode in development:
```bash
NODE_ENV=development pnpm dev
```

### Logs
Check application logs:
- **Vercel**: Dashboard → Functions → View Logs
- **Docker**: `docker logs container-name`
- **PM2**: `pm2 logs oreliya-web`

## 📈 Performance Optimization

### Before Deployment
- [ ] Run `pnpm run build:production` successfully
- [ ] Test all authentication flows
- [ ] Verify file upload functionality
- [ ] Check admin dashboard access
- [ ] Test product creation/editing

### After Deployment
- [ ] Run health check: `/api/health`
- [ ] Test sign-in/sign-up flows
- [ ] Verify admin functionality
- [ ] Check file uploads work
- [ ] Monitor error rates

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm run build:production
      - run: pnpm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Support

If you encounter issues during deployment:
1. Check the health endpoint: `/api/health`
2. Review application logs
3. Verify environment variables
4. Test authentication flows
5. Check file upload functionality

Your application should be fully functional in production with all features working correctly!