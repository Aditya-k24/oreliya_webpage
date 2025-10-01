import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AdminController } from '@/api-lib/controllers/adminController';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import { adminMiddleware } from '@/api-lib/middlewares/adminMiddleware';
import { prisma } from '@/api-lib/prisma';

const adminController = new AdminController(prisma);

export const PUT = createNextRouteHandler(
  authenticateToken,
  adminMiddleware,
  adminController.updateCustomization.bind(adminController)
);

export const DELETE = createNextRouteHandler(
  authenticateToken,
  adminMiddleware,
  adminController.deleteCustomization.bind(adminController)
);


