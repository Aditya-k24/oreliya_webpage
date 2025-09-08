import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { WishlistService } from '../services/wishlistService';
import { asyncWrapper } from '../middlewares/asyncWrapper';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor(wishlistService: WishlistService) {
    this.wishlistService = wishlistService;
  }

  getWishlist = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;
      const result = await this.wishlistService.getWishlist(userId);
      res.json(result);
    }
  );

  addToWishlist = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;
      const { productId } = req.body;

      const result = await this.wishlistService.addToWishlist(
        userId,
        productId
      );
      res.status(201).json(result);
    }
  );

  removeFromWishlist = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;
      const { productId } = req.params;

      const result = await this.wishlistService.removeFromWishlist(
        userId,
        productId
      );
      res.json(result);
    }
  );

  clearWishlist = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;
      const result = await this.wishlistService.clearWishlist(userId);
      res.json(result);
    }
  );
}
