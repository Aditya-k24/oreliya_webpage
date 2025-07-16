import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { WishlistService } from '../services/wishlistService';
import { WishlistRepository } from '../repositories/wishlistRepository';
import { authenticateToken } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router: ExpressRouter = Router();

// Initialize dependencies
const wishlistRepository = new WishlistRepository(prisma);
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

// All wishlist routes require authentication
router.use(authenticateToken);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.get('/check/:productId', wishlistController.checkWishlist);

export default router;
