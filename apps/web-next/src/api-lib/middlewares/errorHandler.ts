import { Request, Response, NextFunction } from 'express';
import { CustomError, isOperationalError } from '../utils/errors';
import logger from '../config/logger';
import { ApiResponse } from '../types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code: string | undefined;

  // Handle custom errors
  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed';
    code = 'DATABASE_ERROR';
  }

  if (error.name === 'PrismaClientValidationError') {
    statusCode = 422;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  }

  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !isOperationalError(error)) {
    message = 'Internal Server Error';
  }

  const response: ApiResponse = {
    success: false,
    message,
    ...(code && { code }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
