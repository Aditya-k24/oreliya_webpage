import { PrismaClient } from '@prisma/client';
import { AddToCartRequest, UpdateCartItemRequest } from '../types/cart';

export class CartRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getCartByUserId(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async addItemToCart(cartId: string, data: AddToCartRequest) {
    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId: data.productId,
      },
    });

    if (existingItem) {
      // Update existing item
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + data.quantity,
          customizations: data.customizations as any,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              images: true,
            },
          },
        },
      });
    }

    // Get product price
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
      select: { price: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Create new item
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId: data.productId,
        quantity: data.quantity,
        price: product.price,
        customizations: data.customizations as any,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        },
      },
    });
  }

  async updateCartItem(itemId: string, data: UpdateCartItemRequest) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: data.quantity,
        customizations: data.customizations as any,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        },
      },
    });
  }

  async removeCartItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async getCartWithItems(cartId: string) {
    return this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }
}
