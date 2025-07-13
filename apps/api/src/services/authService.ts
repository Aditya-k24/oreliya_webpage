import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/userRepository';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  JWTPayload,
} from '../config/jwt';
import {
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
  LogoutResponse,
} from '../types/auth';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '../utils/errors';
import logger from '../config/logger';

export class AuthService {
  private userRepository: UserRepository;

  private refreshTokenRepository: RefreshTokenRepository;

  private readonly SALT_ROUNDS = 12;

  constructor(
    userRepository: UserRepository,
    refreshTokenRepository: RefreshTokenRepository
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async signup(signupData: SignupRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findUserByEmail(
        signupData.email
      );
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        signupData.password,
        this.SALT_ROUNDS
      );

      // Get default user role
      const userRole = await this.userRepository.findRoleByName('user');
      if (!userRole) {
        throw new BadRequestError('Default user role not found');
      }

      // Create user
      const user = await this.userRepository.createUser({
        email: signupData.email,
        password: hashedPassword,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        phone: signupData.phone,
        roleId: userRole.id,
      });

      // Fetch user with role for token generation
      const userWithRole = await this.userRepository.findUserById(user.id);
      if (!userWithRole) {
        throw new BadRequestError('Failed to retrieve user data');
      }

      // Generate tokens
      const tokens = await this.generateTokenPair(userWithRole);

      // Get user without password
      const userWithoutPassword =
        await this.userRepository.findUserWithoutPassword(user.id);
      if (!userWithoutPassword) {
        throw new BadRequestError('Failed to retrieve user data');
      }

      logger.info(`User signed up successfully: ${user.email}`);

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: userWithoutPassword.id,
            email: userWithoutPassword.email,
            firstName: userWithoutPassword.firstName,
            lastName: userWithoutPassword.lastName,
            role: userWithoutPassword.role.name,
          },
          tokens,
        },
      };
    } catch (error) {
      logger.error('Error in signup:', error);
      throw error;
    }
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await this.userRepository.findUserByEmail(loginData.email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate tokens
      const tokens = await this.generateTokenPair(user);

      // Get user without password
      const userWithoutPassword =
        await this.userRepository.findUserWithoutPassword(user.id);
      if (!userWithoutPassword) {
        throw new BadRequestError('Failed to retrieve user data');
      }

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: userWithoutPassword.id,
            email: userWithoutPassword.email,
            firstName: userWithoutPassword.firstName,
            lastName: userWithoutPassword.lastName,
            role: userWithoutPassword.role.name,
          },
          tokens,
        },
      };
    } catch (error) {
      logger.error('Error in login:', error);
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<LogoutResponse> {
    try {
      // Delete refresh token
      await this.refreshTokenRepository.deleteRefreshToken(refreshToken);

      logger.info('User logged out successfully');

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      logger.error('Error in logout:', error);
      throw error;
    }
  }

  async refreshToken(
    refreshTokenData: RefreshTokenRequest
  ): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshTokenData.refreshToken);

      // Check if token exists in database and is valid
      const tokenExists = await this.refreshTokenRepository.isRefreshTokenValid(
        refreshTokenData.refreshToken
      );
      if (!tokenExists) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Get user with role
      const user = await this.userRepository.findUserById(payload.userId);
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      // Generate new token pair
      const tokens = await this.generateTokenPair(user);

      // Delete old refresh token
      await this.refreshTokenRepository.deleteRefreshToken(
        refreshTokenData.refreshToken
      );

      // Get user without password
      const userWithoutPassword =
        await this.userRepository.findUserWithoutPassword(user.id);
      if (!userWithoutPassword) {
        throw new BadRequestError('Failed to retrieve user data');
      }

      logger.info(`Token refreshed for user: ${user.email}`);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: {
            id: userWithoutPassword.id,
            email: userWithoutPassword.email,
            firstName: userWithoutPassword.firstName,
            lastName: userWithoutPassword.lastName,
            role: userWithoutPassword.role.name,
          },
          tokens,
        },
      };
    } catch (error) {
      logger.error('Error in refresh token:', error);
      throw error;
    }
  }

  private async generateTokenPair(user: {
    id: string;
    email: string;
    role: { name: string };
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: Omit<JWTPayload, 'type'> = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  static async validateAccessToken(token: string): Promise<JWTPayload> {
    try {
      return verifyAccessToken(token);
    } catch (error) {
      throw new UnauthorizedError('Invalid access token');
    }
  }
}
