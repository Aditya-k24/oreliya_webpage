import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { CartController } from '../controllers/cartController';
import { CartService } from '../services/cartService';
import { CartRepository } from '../repositories/cartRepository';
import { authenticateToken } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router: ExpressRouter = Router();

// Initialize dependencies
const cartRepository = new CartRepository(prisma);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/items/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
