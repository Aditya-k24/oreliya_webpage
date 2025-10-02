export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AuthController } from '@/api-lib/controllers/authController';
import { AuthService } from '@/api-lib/services/authService';
import { UserRepository } from '@/api-lib/repositories/userRepository';
import { RefreshTokenRepository } from '@/api-lib/repositories/refreshTokenRepository';

async function getAuthController(): Promise<AuthController> {
  const { default: prisma } = await import('@/api-lib/config/database');
  const userRepository = new UserRepository(prisma);
  const refreshTokenRepository = new RefreshTokenRepository(prisma);
  const authService = new AuthService(userRepository, refreshTokenRepository);
  return new AuthController(authService);
}

export const POST = async (request: Request) => {
  const controller = await getAuthController();
  return createNextRouteHandler(controller.signup)(request as any);
};


