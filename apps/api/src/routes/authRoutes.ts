import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';
import { RefreshTokenRepository } from '../repositories/refreshTokenRepository';
import { authenticateToken } from '../middlewares/authMiddleware';
import prisma from '../config/database';

const router: ExpressRouter = Router();

// Initialize dependencies
const userRepository = new UserRepository(prisma);
const refreshTokenRepository = new RefreshTokenRepository(prisma);
const authService = new AuthService(userRepository, refreshTokenRepository);
const authController = new AuthController(authService);

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

// Protected routes
router.get('/me', authenticateToken, authController.me);

export default router;
