import Stripe from 'stripe';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { CreateOrderRequest, OrderResponse } from '../types/order';
import { CustomError } from '../utils/errors';

export class OrderService {
  private orderRepository: OrderRepository;

  private cartRepository: CartRepository;

  private stripe: Stripe;

  constructor(
    orderRepository: OrderRepository,
    cartRepository: CartRepository,
    stripe: Stripe
  ) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.stripe = stripe;
  }

  async createOrder(
    userId: string,
    data: CreateOrderRequest
  ): Promise<OrderResponse> {
    // Get user's cart
    const cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new CustomError('Cart is empty', 400);
    }

    // Validate stock for all items
    await Promise.all(
      cart.items.map((item: any) =>
        this.orderRepository.validateStock(item.productId, item.quantity)
      )
    );

    // Create order
    const order = await this.orderRepository.createOrder(
      userId,
      data,
      cart.items
    );

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.description || '',
            images: item.product.images,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: order.id,
        userId,
      },
    });

    // Update order with session ID
    await this.orderRepository.updateOrderStripeSession(order.id, session.id);

    return {
      success: true,
      data: {
        order: {
          ...order,
          items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            product: {
              ...item.product,
              price: Number(item.product.price),
            },
          })),
        },
        checkoutUrl: session.url || undefined,
      },
    };
  }

  async getOrder(userId: string, orderId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order || order.userId !== userId) {
      throw new CustomError('Order not found', 404);
    }

    return {
      success: true,
      data: {
        order: {
          ...order,
          items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            product: {
              ...item.product,
              price: Number(item.product.price),
            },
          })),
        },
      },
    };
  }

  async getUserOrders(userId: string): Promise<OrderResponse> {
    const orders = await this.orderRepository.getOrdersByUserId(userId);

    return {
      success: true,
      data: {
        orders: orders.map((order: any) => ({
          ...order,
          items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            product: {
              ...item.product,
              price: Number(item.product.price),
            },
          })),
        })),
      },
    };
  }

  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<OrderResponse> {
    const order = await this.orderRepository.updateOrderStatus(orderId, status);

    if (!order) {
      throw new CustomError('Order not found', 404);
    }

    return {
      success: true,
      data: {
        order: {
          ...order,
          items: order.items.map((item: any) => ({
            ...item,
            price: Number(item.price),
            product: {
              ...item.product,
              price: Number(item.product.price),
            },
          })),
        },
      },
    };
  }

  async handleStripeWebhook(payload: string, signature: string): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await this.orderRepository.updateOrderStatus(orderId, 'paid');
        // Clear user's cart after successful payment
        const userId = session.metadata?.userId;
        if (userId) {
          const cart = await this.cartRepository.getCartByUserId(userId);
          if (cart) {
            await this.cartRepository.clearCart(cart.id);
          }
        }
      }
    }
  }
}
