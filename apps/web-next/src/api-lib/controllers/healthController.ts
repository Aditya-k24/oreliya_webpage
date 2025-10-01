import { Request, Response } from 'express';
import { HealthCheckResult, ApiResponse } from '../types';
import { testDatabaseConnection } from '../config/database';
import logger from '../config/logger';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();

  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    const dbResponseTime = Date.now() - startTime;

    // Get memory usage
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    // Get uptime
    const uptime = process.uptime();

    const healthResult: HealthCheckResult = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime,
      services: {
        database: {
          status: dbConnected ? 'connected' : 'disconnected',
          responseTime: dbResponseTime,
        },
        memory: {
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: Math.round(memoryPercentage * 100) / 100,
        },
      },
    };

    const response: ApiResponse<HealthCheckResult> = {
      success: true,
      data: healthResult,
    };

    const statusCode = healthResult.status === 'healthy' ? 200 : 503;

    logger.info('Health check completed', {
      status: healthResult.status,
      dbResponseTime,
      memoryUsage: healthResult.services.memory,
    });

    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Health check failed:', error);

    const response: ApiResponse = {
      success: false,
      message: 'Health check failed',
    };

    res.status(503).json(response);
  }
};
