import { Router } from 'express';
import { WishlistController } from '../controllers/wishlistController';
import { WishlistRepository } from '../repositories/wishlistRepository';
import { WishlistService } from '../services/wishlistService';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const wishlistRepository = new WishlistRepository();
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router;
