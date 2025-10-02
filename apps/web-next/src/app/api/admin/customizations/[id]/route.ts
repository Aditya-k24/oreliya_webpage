export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AdminController } from '@/api-lib/controllers/adminController';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import { adminMiddleware } from '@/api-lib/middlewares/adminMiddleware';
async function getAdminController(): Promise<AdminController> {
  const { default: prisma } = await import('@/api-lib/config/database');
  return new AdminController(prisma);
}

export const PUT = async (request: Request) => {
  const controller = await getAdminController();
  return createNextRouteHandler(
    authenticateToken,
    adminMiddleware,
    controller.updateCustomization.bind(controller)
  )(request as any);
};

export const DELETE = async (request: Request) => {
  const controller = await getAdminController();
  return createNextRouteHandler(
    authenticateToken,
    adminMiddleware,
    controller.deleteCustomization.bind(controller)
  )(request as any);
};


