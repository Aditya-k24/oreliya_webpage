import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cartService';
import { AddToCartRequest, UpdateCartItemRequest } from '../types/cart';
import { AuthenticatedRequest } from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';

export class CartController {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  // GET /api/cart - Get user's cart
  getCart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const result = await this.cartService.getCart(userId);
      return res.status(200).json(result);
    }
  );

  // POST /api/cart/items - Add item to cart
  addToCart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const data: AddToCartRequest = req.body;

      if (!data.productId || !data.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and quantity are required',
        });
      }

      const result = await this.cartService.addToCart(userId, data);
      return res.status(200).json(result);
    }
  );

  // PUT /api/cart/items/:itemId - Update cart item
  updateCartItem = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { itemId } = req.params;
      const data: UpdateCartItemRequest = req.body;

      if (!data.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Quantity is required',
        });
      }

      const result = await this.cartService.updateCartItem(
        userId,
        itemId,
        data
      );
      return res.status(200).json(result);
    }
  );

  // DELETE /api/cart/items/:itemId - Remove item from cart
  removeFromCart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { itemId } = req.params;

      const result = await this.cartService.removeFromCart(userId, itemId);
      return res.status(200).json(result);
    }
  );

  // DELETE /api/cart - Clear cart
  clearCart = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const result = await this.cartService.clearCart(userId);
      return res.status(200).json(result);
    }
  );
}
