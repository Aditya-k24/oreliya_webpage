import { PrismaClient } from '@prisma/client';
import logger from './logger';

// Global Prisma client instance for production
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? [
    {
      emit: 'stdout',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Ensure Prisma client is properly initialized
if (typeof prisma === 'undefined') {
  throw new Error('Prisma client is undefined. Check DATABASE_URL environment variable.');
}

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

// Connection management for production
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting database:', error);
  }
};

// Handle process termination in production
if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    await disconnectDatabase();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

export default prisma;
