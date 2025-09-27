# Production Deployment Guide

## Prerequisites

1. **Environment Variables**: Set up all required environment variables
2. **Database**: Configure your production database
3. **API Backend**: Ensure your API backend is running and accessible
4. **File Storage**: Configure file upload storage (AWS S3, Cloudinary, etc.)

## Environment Variables

Create a `.env.production` file with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here

# API Configuration
API_BASE_URL=https://your-api-domain.com/api

# Database (if using)
DATABASE_URL=your-production-database-url

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Security
JWT_SECRET=your-jwt-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here

# Logging
LOG_LEVEL=info
```

## Build and Deploy

### 1. Build for Production

```bash
# Install dependencies
pnpm install

# Type check
pnpm type-check

# Lint check
pnpm lint

# Build for production
pnpm build:production
```

### 2. Start Production Server

```bash
pnpm start:production
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Deploy to Docker

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build:production

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## Security Checklist

- [ ] All environment variables are set
- [ ] NEXTAUTH_SECRET is a strong, random string
- [ ] API endpoints are secured with proper authentication
- [ ] File uploads are validated and sanitized
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Security headers are enabled
- [ ] HTTPS is enforced
- [ ] Database connections are encrypted
- [ ] Logs don't contain sensitive information

## Performance Optimizations

- [ ] Images are optimized
- [ ] Bundle is minified
- [ ] Static assets are cached
- [ ] Database queries are optimized
- [ ] CDN is configured
- [ ] Compression is enabled

## Monitoring

- [ ] Error tracking (Sentry, Bugsnag)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Log aggregation (ELK, Splunk)
- [ ] Uptime monitoring
- [ ] Security scanning

## Backup Strategy

- [ ] Database backups
- [ ] File storage backups
- [ ] Configuration backups
- [ ] Disaster recovery plan

## Testing

```bash
# Run tests
pnpm test:run

# Run E2E tests
pnpm test:e2e

# Type check
pnpm type-check

# Lint check
pnpm lint
```

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
2. **File uploads failing**: Check file size limits and allowed types
3. **API calls failing**: Verify API_BASE_URL and CORS settings
4. **Build failures**: Check for TypeScript errors and missing dependencies

### Logs

Check application logs for errors:
```bash
# Vercel
vercel logs

# Docker
docker logs <container-name>

# PM2
pm2 logs
```
