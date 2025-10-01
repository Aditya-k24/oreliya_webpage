import { WishlistRepository } from '../repositories/wishlistRepository';
import { WishlistResponse } from '../types/wishlist';

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
    await this.wishlistRepository.addToWishlist(userId, productId);

    return this.getWishlist(userId);
  }

  async removeFromWishlist(
    userId: string,
    productId: string
  ): Promise<WishlistResponse> {
    await this.wishlistRepository.removeFromWishlist(userId, productId);

    return this.getWishlist(userId);
  }

  async clearWishlist(userId: string): Promise<WishlistResponse> {
    await this.wishlistRepository.clearWishlist(userId);

    return this.getWishlist(userId);
  }
}
