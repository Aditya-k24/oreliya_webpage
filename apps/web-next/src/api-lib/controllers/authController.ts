import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import {
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
} from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signup = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const signupData: SignupRequest = req.body;

      // Basic validation
      if (
        !signupData.email ||
        !signupData.password ||
        !signupData.firstName ||
        !signupData.lastName
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Missing required fields: email, password, firstName, lastName',
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signupData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
      }

      // Password validation (minimum 8 characters)
      if (signupData.password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long',
        });
      }

      const result = await this.authService.signup(signupData);
      return res.status(201).json(result);
    }
  );

  login = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const loginData: LoginRequest = req.body;

      // Basic validation
      if (!loginData.email || !loginData.password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await this.authService.login(loginData);
      return res.status(200).json(result);
    }
  );

  logout = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      const result = await this.authService.logout(refreshToken);
      return res.status(200).json(result);
    }
  );

  refresh = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const refreshData: RefreshTokenRequest = req.body;

      if (!refreshData.refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      const result = await this.authService.refreshToken(refreshData);
      return res.status(200).json(result);
    }
  );

  me = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      // This endpoint requires authentication middleware
      // The user info will be available in req.user
      const { user } = req as {
        user?: { id: string; email: string; role: string };
      };

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
      });
    }
  );
}
