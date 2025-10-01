import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AuthController } from '@/api-lib/controllers/authController';
import { AuthService } from '@/api-lib/services/authService';
import { UserRepository } from '@/api-lib/repositories/userRepository';
import { RefreshTokenRepository } from '@/api-lib/repositories/refreshTokenRepository';
import prisma from '@/api-lib/config/database';

const userRepository = new UserRepository(prisma);
const refreshTokenRepository = new RefreshTokenRepository(prisma);
const authService = new AuthService(userRepository, refreshTokenRepository);
const authController = new AuthController(authService);

export const POST = createNextRouteHandler(authController.signup);


