import { PrismaClient, RefreshToken } from '@prisma/client';
import logger from '../config/logger';

export class RefreshTokenRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createRefreshToken(tokenData: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;
    let currentTokenData = { ...tokenData };
    let success = false;
    let refreshToken: RefreshToken | null = null;
    while (attempts < maxAttempts && !success) {
      try {
        // eslint-disable-next-line no-await-in-loop
        refreshToken = await this.prisma.refreshToken.create({
          data: currentTokenData,
        });
        logger.info(
          `Refresh token created for user: ${currentTokenData.userId}`
        );
        success = true;
      } catch (error: any) {
        // Prisma unique constraint error code
        if (error.code === 'P2002' && error.meta?.target?.includes('token')) {
          logger.warn('Duplicate refresh token generated, retrying...');
          const newToken = `${currentTokenData.token}-${Math.random().toString(36).slice(2, 8)}`;
          currentTokenData = { ...currentTokenData, token: newToken };
          attempts += 1;
          lastError = error;
        } else {
          logger.error('Error creating refresh token:', error);
          throw error;
        }
      }
    }
    if (success && refreshToken) {
      return refreshToken;
    }
    logger.error(
      'Failed to create unique refresh token after retries:',
      lastError
    );
    throw lastError;
  }

  async findRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    try {
      return await this.prisma.refreshToken.findUnique({
        where: { token },
        include: {
          user: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding refresh token by token:', error);
      throw error;
    }
  }

  async findRefreshTokenByUserId(userId: string): Promise<RefreshToken[]> {
    try {
      return await this.prisma.refreshToken.findMany({
        where: { userId },
        include: {
          user: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error finding refresh tokens by user ID:', error);
      throw error;
    }
  }

  async deleteRefreshToken(token: string): Promise<boolean> {
    try {
      await this.prisma.refreshToken.delete({
        where: { token },
      });
      logger.info(`Refresh token deleted: ${token}`);
      return true;
    } catch (error) {
      logger.error('Error deleting refresh token:', error);
      throw error;
    }
  }

  async deleteAllRefreshTokensForUser(userId: string): Promise<boolean> {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
      logger.info(`All refresh tokens deleted for user: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting all refresh tokens for user:', error);
      throw error;
    }
  }

  async deleteExpiredRefreshTokens(): Promise<number> {
    try {
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      logger.info(`Deleted ${result.count} expired refresh tokens`);
      return result.count;
    } catch (error) {
      logger.error('Error deleting expired refresh tokens:', error);
      throw error;
    }
  }

  async isRefreshTokenValid(token: string): Promise<boolean> {
    try {
      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });
      return refreshToken !== null && refreshToken.expiresAt > new Date();
    } catch (error) {
      logger.error('Error checking refresh token validity:', error);
      throw error;
    }
  }
}
