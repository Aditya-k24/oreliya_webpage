// Production configuration
export const productionConfig = {
  auth: {
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
    url: process.env.NEXTAUTH_URL || 'https://your-domain.com',
  },
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://your-api-domain.com/api',
    timeout: 10000, // 10 seconds
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
    encryptionKey: process.env.ENCRYPTION_KEY || 'fallback-encryption-key',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
