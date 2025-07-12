import { Request, Response, NextFunction } from 'express';
import { AsyncRequestHandler } from '../types';
import logger from '../config/logger';

export const asyncWrapper = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(error => {
      logger.error('Async wrapper error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
      });
      next(error);
    });
  };
};
