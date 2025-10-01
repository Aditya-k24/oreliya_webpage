import { PrismaClient } from '@prisma/client';

export class WishlistRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getWishlistByUserId(userId: string) {
    const wishlistItems = await this.prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isOnSale: true,
            salePercentage: true,
          },
        },
      },
    });

    return {
      userId,
      items: wishlistItems,
      totalItems: wishlistItems.length,
    };
  }

  async addToWishlist(userId: string, productId: string) {
    // Check if already in wishlist
    const existing = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new Error('Product already in wishlist');
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            isOnSale: true,
            salePercentage: true,
          },
        },
      },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    return this.prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async clearWishlist(userId: string) {
    return this.prisma.wishlist.deleteMany({
      where: { userId },
    });
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!item;
  }
}
