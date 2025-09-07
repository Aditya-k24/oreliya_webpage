import { CartRepository } from '../repositories/cartRepository';
import {
  AddToCartRequest,
  UpdateCartItemRequest,
  CartResponse,
} from '../types/cart';
import { CustomError } from '../utils/errors';

export class CartService {
  private cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  async getCart(userId: string): Promise<CartResponse> {
    let cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    const totalItems = cart.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * item.quantity,
      0
    );

    return {
      success: true,
      data: {
        cart: {
          id: cart.id,
          userId: cart.userId,
          items: cart.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            customizations: item.customizations as
              | Record<string, any>
              | undefined,
            product: {
              ...item.product,
              price: Number(item.product.price),
            },
          })),
          totalItems,
          subtotal,
        },
      },
    };
  }

  async addToCart(
    userId: string,
    data: AddToCartRequest
  ): Promise<CartResponse> {
    // Validate quantity
    if (data.quantity <= 0) {
      throw new CustomError('Quantity must be greater than 0', 400);
    }

    let cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    await this.cartRepository.addItemToCart(cart.id, data);

    // Return updated cart
    return this.getCart(userId);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    data: UpdateCartItemRequest
  ): Promise<CartResponse> {
    // Validate quantity
    if (data.quantity <= 0) {
      throw new CustomError('Quantity must be greater than 0', 400);
    }

    await this.cartRepository.updateCartItem(itemId, data);

    // Return updated cart
    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<CartResponse> {
    await this.cartRepository.removeCartItem(itemId);

    // Return updated cart
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<CartResponse> {
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (cart) {
      await this.cartRepository.clearCart(cart.id);
    }

    // Return empty cart
    return this.getCart(userId);
  }
}
