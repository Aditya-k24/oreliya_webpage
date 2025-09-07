import { WishlistRepository } from '../repositories/wishlistRepository';
import { WishlistResponse } from '../types/wishlist';
import { CustomError } from '../utils/errors';

export class WishlistService {
  private wishlistRepository: WishlistRepository;

  constructor(wishlistRepository: WishlistRepository) {
    this.wishlistRepository = wishlistRepository;
  }

  async getWishlist(userId: string): Promise<WishlistResponse> {
    const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);

    return {
      success: true,
      data: {
        wishlist: {
          id: `wishlist-${userId}`, // Virtual ID for consistency
          userId: wishlist.userId,
          items: wishlist.items.map((item: any) => ({
            ...item,
            product: {
              ...item.product,
              price: Number(item.product.price),
              salePercentage: item.product.salePercentage ?? undefined,
            },
          })),
          totalItems: wishlist.totalItems,
        },
      },
    };
  }

  async addToWishlist(
    userId: string,
    productId: string
  ): Promise<WishlistResponse> {
    try {
      await this.wishlistRepository.addToWishlist(userId, productId);
      return await this.getWishlist(userId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Product already in wishlist'
      ) {
        throw new CustomError('Product is already in your wishlist', 400);
      }
      throw error;
    }
  }

  async removeFromWishlist(
    userId: string,
    productId: string
  ): Promise<WishlistResponse> {
    await this.wishlistRepository.removeFromWishlist(userId, productId);
    return this.getWishlist(userId);
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    return this.wishlistRepository.isInWishlist(userId, productId);
  }
}
