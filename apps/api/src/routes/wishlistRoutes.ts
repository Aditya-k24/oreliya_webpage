import { Router } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { WishlistService } from '../services/wishlistService';
import { WishlistRepository } from '../repositories/wishlistRepository';
import { prisma } from '../lib/prisma';

const router: Router = Router();

// Initialize repositories and services
const wishlistRepository = new WishlistRepository(prisma);
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

// Routes
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router;
