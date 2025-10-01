import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { CartController } from '@/api-lib/controllers/cartController';
import { CartService } from '@/api-lib/services/cartService';
import { CartRepository } from '@/api-lib/repositories/cartRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import { prisma } from '@/api-lib/prisma';

const cartRepository = new CartRepository(prisma);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

export const PUT = createNextRouteHandler(authenticateToken, cartController.updateCartItem);
export const DELETE = createNextRouteHandler(authenticateToken, cartController.removeFromCart);


