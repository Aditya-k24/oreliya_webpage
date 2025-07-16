import express, { RequestHandler } from 'express';
import request from 'supertest';
import { AuthController } from '../../controllers/authController';
import { AuthService } from '../../services/authService';
import { AuthenticatedRequest } from '../../types/auth';

// Mock the services
jest.mock('../../services/authService');
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {},
}));

describe('Auth Routes', () => {
  let app: express.Application;
  let mockAuthService: AuthService;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Create a real AuthService instance with dummy repositories
    mockAuthService = new AuthService(
      {} as unknown as any,
      {} as unknown as any
    );
    jest.spyOn(mockAuthService, 'signup').mockImplementation(jest.fn());
    jest.spyOn(mockAuthService, 'login').mockImplementation(jest.fn());
    jest.spyOn(mockAuthService, 'logout').mockImplementation(jest.fn());
    jest.spyOn(mockAuthService, 'refreshToken').mockImplementation(jest.fn());

    // Create controller with mocked service
    const mockAuthController = new AuthController(mockAuthService);

    // Set up routes
    app.post('/api/auth/signup', mockAuthController.signup);
    app.post('/api/auth/login', mockAuthController.login);
    app.post('/api/auth/logout', mockAuthController.logout);
    app.post('/api/auth/refresh', mockAuthController.refresh);
    app.get('/api/auth/me', mockAuthController.me);
  });

  describe('POST /api/auth/signup', () => {
    const validSignupData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
    };

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          // missing password, firstName, lastName
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...validSignupData,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email format');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...validSignupData,
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Password must be at least 8 characters long'
      );
    });

    it('should return 201 for valid signup data', async () => {
      const mockResponse = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        },
      };

      (mockAuthService.signup as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.tokens).toBeDefined();
      expect(mockAuthService.signup).toHaveBeenCalledWith(validSignupData);
    });
  });

  describe('POST /api/auth/login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return 400 for missing email or password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          // missing password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 200 for valid login data', async () => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          },
          tokens: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
          },
        },
      };

      (mockAuthService.login as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.tokens).toBeDefined();
      expect(mockAuthService.login).toHaveBeenCalledWith(validLoginData);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 400 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Refresh token is required');
    });

    it('should return 200 for valid logout request', async () => {
      const mockResponse = {
        success: true,
        message: 'Logout successful',
      };

      (mockAuthService.logout as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'valid-refresh-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        'valid-refresh-token'
      );
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return 400 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Refresh token is required');
    });

    it('should return 200 for valid refresh request', async () => {
      const mockResponse = {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          },
          tokens: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        },
      };

      (mockAuthService.refreshToken as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'valid-refresh-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.tokens).toBeDefined();
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith({
        refreshToken: 'valid-refresh-token',
      });
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Authentication required');
    });

    it('should return 200 with valid authentication', async () => {
      // Create a new app instance for this test with mocked auth
      const testApp = express();
      testApp.use(express.json());

      // Mock the authentication middleware
      const mockAuthMiddleware: RequestHandler = (req, _res, next) => {
        (req as unknown as AuthenticatedRequest).user = {
          id: 'user-1',
          email: 'test@example.com',
          role: 'user',
        };
        next();
      };

      // Create controller for this test
      const testAuthController = new AuthController(mockAuthService);

      // Set up route with mocked auth
      testApp.get('/api/auth/me', mockAuthMiddleware, testAuthController.me);

      const response = await request(testApp).get('/api/auth/me').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User profile retrieved successfully');
      expect(response.body.data.user).toBeDefined();
    });
  });
});
