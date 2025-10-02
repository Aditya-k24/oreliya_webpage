export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AdminController } from '@/api-lib/controllers/adminController';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import { adminMiddleware } from '@/api-lib/middlewares/adminMiddleware';
import prisma from '@/api-lib/config/database';

const adminController = new AdminController(prisma);

export const GET = createNextRouteHandler(
  authenticateToken,
  adminMiddleware,
  adminController.getStats.bind(adminController)
);


