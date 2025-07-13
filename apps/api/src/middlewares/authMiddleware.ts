import { Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../config/jwt';
import { AuthenticatedRequest } from '../types/auth';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import logger from '../config/logger';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    const payload = verifyAccessToken(token);

    // Add user info to request
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    logger.debug(`User authenticated: ${payload.email} (${payload.role})`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new UnauthorizedError('Invalid or expired access token'));
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        );
      }

      logger.debug(
        `Role check passed for user: ${req.user.email} (${req.user.role})`
      );
      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      next(error);
    }
  };
};

export const requireUser = requireRole(['user', 'admin']);
export const requireAdmin = requireRole(['admin']);

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req);
    if (token) {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      };
      logger.debug(`Optional auth - User authenticated: ${payload.email}`);
    } else {
      logger.debug('Optional auth - No token provided');
    }
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    logger.debug('Optional auth - Invalid token, continuing without user');
    next();
  }
};
