import { PrismaClient } from '../../../prisma/generated/client';
import logger from './logger';

let prismaInstance: PrismaClient | undefined;

function createPrismaClient(): PrismaClient {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  
  // Configure database URL for Transaction Pooler compatibility
  let databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && databaseUrl.includes('pooler.supabase.com')) {
    // Add parameters to disable prepared statements for pooler
    const url = new URL(databaseUrl);
    url.searchParams.set('pgbouncer', 'true');
    url.searchParams.set('prepared_statements', 'false');
    url.searchParams.set('connection_limit', '10');
    databaseUrl = url.toString();
  }
  
  return new PrismaClient({
    log: isProduction ? [] : ['error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient();
  }
  return prismaInstance;
}

// Export a proxy that lazily initializes Prisma on first property access
const prisma = new Proxy({} as unknown as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrisma() as any;
    return client[prop];
  },
});

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

export const connectDatabase = async (): Promise<void> => {
  try {
    await getPrisma().$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      logger.info('Database disconnected successfully');
    }
  } catch (error) {
    logger.error('Error disconnecting database:', error);
  }
};

export default prisma;
