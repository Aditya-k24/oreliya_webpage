import bcrypt from 'bcryptjs';
import { AuthService } from '../../services/authService';
import { UserRepository } from '../../repositories/userRepository';
import { RefreshTokenRepository } from '../../repositories/refreshTokenRepository';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '../../utils/errors';

// Mock JWT functions
jest.mock('../../config/jwt', () => ({
  generateAccessToken: jest.fn(() => 'mock-access-token'),
  generateRefreshToken: jest.fn(() => 'mock-refresh-token'),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

// Mock repositories
const mockUserRepository = jest.mocked({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  findUserWithoutPassword: jest.fn(),
  createUser: jest.fn(),
  findRoleByName: jest.fn(),
  userExists: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findRoleById: jest.fn(),
  getAllRoles: jest.fn(),
  createRole: jest.fn(),
} as unknown as UserRepository);

const mockRefreshTokenRepository = jest.mocked({
  createRefreshToken: jest.fn(),
  findRefreshTokenByToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
  isRefreshTokenValid: jest.fn(),
  findRefreshTokenByUserId: jest.fn(),
  deleteAllRefreshTokensForUser: jest.fn(),
  deleteExpiredRefreshTokens: jest.fn(),
} as unknown as RefreshTokenRepository);

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      mockUserRepository,
      mockRefreshTokenRepository
    );
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const mockSignupData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
    };

    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isActive: true,
      emailVerified: false,
      roleId: 'role-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockUserWithoutPassword = {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isActive: true,
      emailVerified: false,
      role: {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully create a new user', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findRoleByName.mockResolvedValue({
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockUserRepository.createUser.mockResolvedValue(mockUser);
      mockUserRepository.findUserById.mockResolvedValue(mockUser);
      mockUserRepository.findUserWithoutPassword.mockResolvedValue(
        mockUserWithoutPassword
      );
      mockRefreshTokenRepository.createRefreshToken.mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        token: 'refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.signup(mockSignupData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User registered successfully');
      expect(result.data?.user.email).toBe(mockSignupData.email);
      expect(result.data?.tokens).toBeDefined();
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockSignupData.email,
          firstName: mockSignupData.firstName,
          lastName: mockSignupData.lastName,
          phone: mockSignupData.phone,
        })
      );
    });

    it('should throw ConflictError if user already exists', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      await expect(authService.signup(mockSignupData)).rejects.toThrow(
        ConflictError
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if default user role not found', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findRoleByName.mockResolvedValue(null);

      await expect(authService.signup(mockSignupData)).rejects.toThrow(
        BadRequestError
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isActive: true,
      emailVerified: false,
      roleId: 'role-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockUserWithoutPassword = {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isActive: true,
      emailVerified: false,
      role: {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully login a user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      mockUserRepository.findUserByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });
      mockUserRepository.findUserWithoutPassword.mockResolvedValue(
        mockUserWithoutPassword
      );
      mockRefreshTokenRepository.createRefreshToken.mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        token: 'refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.login(mockLoginData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful');
      expect(result.data?.user.email).toBe(mockLoginData.email);
      expect(result.data?.tokens).toBeDefined();
    });

    it('should throw UnauthorizedError if user not found', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should throw UnauthorizedError if user is inactive', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it('should throw UnauthorizedError if password is incorrect', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(mockLoginData)).rejects.toThrow(
        UnauthorizedError
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      const refreshToken = 'valid-refresh-token';
      mockRefreshTokenRepository.deleteRefreshToken.mockResolvedValue(true);

      const result = await authService.logout(refreshToken);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Logout successful');
      expect(
        mockRefreshTokenRepository.deleteRefreshToken
      ).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('refreshToken', () => {
    const mockRefreshTokenData = {
      refreshToken: 'valid-refresh-token',
    };

    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isActive: true,
      emailVerified: false,
      roleId: 'role-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const mockUserWithoutPassword = {
      id: 'user-1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      isActive: true,
      emailVerified: false,
      role: {
        id: 'role-1',
        name: 'user',
        description: 'Regular user',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully refresh tokens', async () => {
      const { verifyRefreshToken } = jest.requireMock('../../config/jwt');
      verifyRefreshToken.mockReturnValue({
        userId: 'user-1',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });

      mockRefreshTokenRepository.isRefreshTokenValid.mockResolvedValue(true);
      mockUserRepository.findUserById.mockResolvedValue(mockUser);
      mockUserRepository.findUserWithoutPassword.mockResolvedValue(
        mockUserWithoutPassword
      );
      mockRefreshTokenRepository.createRefreshToken.mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        token: 'new-refresh-token',
        expiresAt: new Date(),
        createdAt: new Date(),
      });
      mockRefreshTokenRepository.deleteRefreshToken.mockResolvedValue(true);

      const result = await authService.refreshToken(mockRefreshTokenData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Token refreshed successfully');
      expect(result.data?.tokens).toBeDefined();
    });

    it('should throw UnauthorizedError if refresh token is invalid', async () => {
      const { verifyRefreshToken } = jest.requireMock('../../config/jwt');
      verifyRefreshToken.mockImplementation(() => {
        throw new UnauthorizedError('Invalid token');
      });

      await expect(
        authService.refreshToken(mockRefreshTokenData)
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if user not found or inactive', async () => {
      const { verifyRefreshToken } = jest.requireMock('../../config/jwt');
      verifyRefreshToken.mockReturnValue({
        userId: 'user-1',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });

      mockRefreshTokenRepository.isRefreshTokenValid.mockResolvedValue(true);
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(
        authService.refreshToken(mockRefreshTokenData)
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
