import { Request, Response, NextFunction } from 'express';
import { WishlistService } from '../services/wishlistService';
import { AuthenticatedRequest } from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';

export class WishlistController {
  private wishlistService: WishlistService;

  constructor(wishlistService: WishlistService) {
    this.wishlistService = wishlistService;
  }

  // GET /api/wishlist - Get user's wishlist
  getWishlist = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const result = await this.wishlistService.getWishlist(userId);
      return res.status(200).json(result);
    }
  );

  // POST /api/wishlist - Add product to wishlist
  addToWishlist = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }

      const result = await this.wishlistService.addToWishlist(
        userId,
        productId
      );
      return res.status(200).json(result);
    }
  );

  // DELETE /api/wishlist/:productId - Remove product from wishlist
  removeFromWishlist = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { productId } = req.params;

      const result = await this.wishlistService.removeFromWishlist(
        userId,
        productId
      );
      return res.status(200).json(result);
    }
  );

  // GET /api/wishlist/check/:productId - Check if product is in wishlist
  checkWishlist = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { productId } = req.params;

      const isInWishlist = await this.wishlistService.isInWishlist(
        userId,
        productId
      );
      return res.status(200).json({
        success: true,
        data: { isInWishlist },
      });
    }
  );
}
