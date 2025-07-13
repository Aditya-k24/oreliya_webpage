import { Response, NextFunction } from 'express';
import {
  authenticateToken,
  requireRole,
  requireUser,
  requireAdmin,
  optionalAuth,
} from '../../middlewares/authMiddleware';
import { AuthenticatedRequest } from '../../types/auth';
import { UnauthorizedError, ForbiddenError } from '../../utils/errors';

// Mock JWT functions
jest.mock('../../config/jwt', () => ({
  verifyAccessToken: jest.fn(),
  extractTokenFromHeader: jest.fn(),
}));

const { verifyAccessToken, extractTokenFromHeader } =
  jest.requireMock('../../config/jwt');

describe('Auth Middleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn() as jest.MockedFunction<NextFunction>;
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should call next() with user data when valid token is provided', () => {
      const mockPayload = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      extractTokenFromHeader.mockReturnValue('valid-token');
      verifyAccessToken.mockReturnValue(mockPayload);

      authenticateToken(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.user).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        role: 'user',
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() with UnauthorizedError when no token is provided', () => {
      extractTokenFromHeader.mockReturnValue(null);

      authenticateToken(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(
        (mockNext.mock.calls[0][0] as unknown as UnauthorizedError).message
      ).toBe('Invalid or expired access token');
    });

    it('should call next() with UnauthorizedError when token verification fails', () => {
      extractTokenFromHeader.mockReturnValue('invalid-token');
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticateToken(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(
        (mockNext.mock.calls[0][0] as unknown as UnauthorizedError).message
      ).toBe('Invalid or expired access token');
    });
  });

  describe('requireRole', () => {
    it('should call next() when user has required role', () => {
      mockReq.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'admin',
      };

      const middleware = requireRole(['admin', 'user']);
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() with UnauthorizedError when no user is present', () => {
      const middleware = requireRole(['admin']);
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(
        (mockNext.mock.calls[0][0] as unknown as UnauthorizedError).message
      ).toBe('Authentication required');
    });

    it('should call next() with ForbiddenError when user does not have required role', () => {
      mockReq.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'user',
      };

      const middleware = requireRole(['admin']);
      middleware(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(
        (mockNext.mock.calls[0][0] as unknown as ForbiddenError).message
      ).toBe('Access denied. Required roles: admin');
    });
  });

  describe('requireUser', () => {
    it('should call next() when user has user role', () => {
      mockReq.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'user',
      };

      requireUser(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() when user has admin role', () => {
      mockReq.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'admin',
      };

      requireUser(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('requireAdmin', () => {
    it('should call next() when user has admin role', () => {
      mockReq.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'admin',
      };

      requireAdmin(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() with ForbiddenError when user has user role', () => {
      mockReq.user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'user',
      };

      requireAdmin(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(
        (mockNext.mock.calls[0][0] as unknown as ForbiddenError).message
      ).toBe('Access denied. Required roles: admin');
    });
  });

  describe('optionalAuth', () => {
    it('should set user data and call next() when valid token is provided', () => {
      const mockPayload = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      extractTokenFromHeader.mockReturnValue('valid-token');
      verifyAccessToken.mockReturnValue(mockPayload);

      optionalAuth(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.user).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        role: 'user',
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() without user data when no token is provided', () => {
      extractTokenFromHeader.mockReturnValue(null);

      optionalAuth(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next() without user data when token verification fails', () => {
      extractTokenFromHeader.mockReturnValue('invalid-token');
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      optionalAuth(
        mockReq as AuthenticatedRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
