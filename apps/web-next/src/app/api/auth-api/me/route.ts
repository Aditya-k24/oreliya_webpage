export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AuthController } from '@/api-lib/controllers/authController';
import { AuthService } from '@/api-lib/services/authService';
import { UserRepository } from '@/api-lib/repositories/userRepository';
import { RefreshTokenRepository } from '@/api-lib/repositories/refreshTokenRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import prisma from '@/api-lib/config/database';

const userRepository = new UserRepository(prisma);
const refreshTokenRepository = new RefreshTokenRepository(prisma);
const authService = new AuthService(userRepository, refreshTokenRepository);
const authController = new AuthController(authService);

export const GET = createNextRouteHandler(authenticateToken, authController.me);


