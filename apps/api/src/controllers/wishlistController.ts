import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlistService';
import { asyncWrapper } from '../middlewares/asyncWrapper';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor(wishlistService: WishlistService) {
    this.wishlistService = wishlistService;
  }

  getWishlist = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await this.wishlistService.getWishlist(userId);

      res.json(result);
    }
  );

  addToWishlist = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { productId } = req.body;
      const result = await this.wishlistService.addToWishlist(
        userId,
        productId
      );

      res.status(201).json(result);
    }
  );

  removeFromWishlist = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { productId } = req.params;
      const result = await this.wishlistService.removeFromWishlist(
        userId,
        productId
      );

      res.json(result);
    }
  );

  clearWishlist = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await this.wishlistService.clearWishlist(userId);

      res.json(result);
    }
  );
}
