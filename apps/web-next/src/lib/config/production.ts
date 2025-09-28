/**
 * Production Configuration
 * This file contains production-specific configurations
 */

export const productionConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://yourdomain.com/api',
    timeout: 30000, // 30 seconds
    retries: 3,
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-production',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    uploadDir: 'public/uploads',
  },

  // Email
  email: {
    provider: 'resend',
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: 'noreply@yourdomain.com',
    replyTo: 'support@yourdomain.com',
  },

  // Security
  security: {
    corsOrigin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
    },
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Monitoring
  monitoring: {
    enableLogging: true,
    logLevel: process.env.LOG_LEVEL || 'info',
    enableMetrics: true,
  },

  // Database (when implemented)
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
    poolSize: 10,
  },

  // Cache
  cache: {
    ttl: 3600, // 1 hour
    maxSize: 100, // items
  },

  // Feature Flags
  features: {
    enableAnalytics: !!process.env.GOOGLE_ANALYTICS_ID,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },
};

// Validation function to ensure required environment variables are set
export function validateProductionConfig() {
  const required = [
    'NEXTAUTH_SECRET',
    'API_BASE_URL',
    'RESEND_API_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Production-specific utilities
export const productionUtils = {
  // Check if running in production
  isProduction: () => process.env.NODE_ENV === 'production',

  // Get environment-specific URL
  getBaseUrl: () => {
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXTAUTH_URL || 'https://yourdomain.com';
    }
    return 'http://localhost:3002';
  },

  // Get API base URL
  getApiUrl: () => {
    if (process.env.NODE_ENV === 'production') {
      return process.env.API_BASE_URL || 'https://yourdomain.com/api';
    }
    return 'http://localhost:3001/api';
  },

  // Sanitize environment variables for logging
  sanitizeEnv: () => {
    const sanitized: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN')) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = process.env[key] || '';
      }
    });
    return sanitized;
  },
};