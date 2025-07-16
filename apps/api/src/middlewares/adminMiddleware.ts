import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user from request (set by auth middleware)
    const { user } = req as {
      user?: { id: string; email: string; role: string };
    };

    if (!user) {
      throw new CustomError('Authentication required', 401);
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      throw new CustomError('Admin access required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Export for backward compatibility
export const adminMiddleware = requireAdmin;
