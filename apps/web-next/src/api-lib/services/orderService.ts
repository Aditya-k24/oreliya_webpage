import Stripe from 'stripe';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import {
  CreateOrderRequest,
  OrderResponse,
  OrderListResponse,
  OrderItem,
} from '../types/order';

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
    orderData: CreateOrderRequest
  ): Promise<OrderResponse> {
    // Get cart
    const cart = await this.cartRepository.getCartByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate stock for all items
    const stockValidationPromises = cart.items.map(item =>
      this.orderRepository.validateStock(item.productId, item.quantity)
    );
    const stockValidationResults = await Promise.all(stockValidationPromises);

    const invalidItems = stockValidationResults.some(isValid => !isValid);
    if (invalidItems) {
      throw new Error('Insufficient stock for some products');
    }

    // Create order
    const order = await this.orderRepository.createOrder(
      userId,
      orderData,
      cart.items
    );

    // Create Stripe checkout session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: item.product.images,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?cancelled=true`,
      metadata: {
        orderId: order.id,
        userId,
      },
    });

    // Update order with Stripe session ID
    await this.orderRepository.updateOrderStripeSession(order.id, session.id);

    // Clear cart after successful order creation
    await this.cartRepository.clearCart(cart.id);

    return {
      success: true,
      data: {
        order: {
          ...order,
          status: order.status as
            | 'pending'
            | 'processing'
            | 'shipped'
            | 'delivered'
            | 'cancelled',
          subtotal: Number(order.subtotal),
          taxAmount: Number(order.taxAmount),
          shippingAmount: Number(order.shippingAmount),
          discountAmount: Number(order.discountAmount),
          totalAmount: Number(order.totalAmount),
          paymentStatus:
            (order.paymentStatus as 'pending' | 'paid' | 'failed') || 'pending',
          items: OrderService.mapOrderItems(order.items),
        },
        checkoutUrl: session.url,
      },
    };
  }

  async getOrderById(orderId: string, userId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return {
      success: true,
      data: {
        order: {
          ...order,
          status: order.status as
            | 'pending'
            | 'processing'
            | 'shipped'
            | 'delivered'
            | 'cancelled',
          subtotal: Number(order.subtotal),
          taxAmount: Number(order.taxAmount),
          shippingAmount: Number(order.shippingAmount),
          discountAmount: Number(order.discountAmount),
          totalAmount: Number(order.totalAmount),
          paymentStatus:
            (order.paymentStatus as 'pending' | 'paid' | 'failed') || 'pending',
          items: OrderService.mapOrderItems(order.items),
        },
      },
    };
  }

  async getOrdersByUserId(userId: string): Promise<OrderListResponse> {
    const orders = await this.orderRepository.getOrdersByUserId(userId);

    return {
      success: true,
      data: {
        orders: orders.map(order => ({
          ...order,
          status: order.status as
            | 'pending'
            | 'processing'
            | 'shipped'
            | 'delivered'
            | 'cancelled',
          subtotal: Number(order.subtotal),
          taxAmount: Number(order.taxAmount),
          shippingAmount: Number(order.shippingAmount),
          discountAmount: Number(order.discountAmount),
          totalAmount: Number(order.totalAmount),
          paymentStatus:
            (order.paymentStatus as 'pending' | 'paid' | 'failed') || 'pending',
          items: OrderService.mapOrderItems(order.items),
        })),
      },
    };
  }

  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<OrderResponse> {
    const order = await this.orderRepository.updateOrderStatus(orderId, status);

    return {
      success: true,
      data: {
        order: {
          ...order,
          status: order.status as
            | 'pending'
            | 'processing'
            | 'shipped'
            | 'delivered'
            | 'cancelled',
          subtotal: Number(order.subtotal),
          taxAmount: Number(order.taxAmount),
          shippingAmount: Number(order.shippingAmount),
          discountAmount: Number(order.discountAmount),
          totalAmount: Number(order.totalAmount),
          paymentStatus:
            (order.paymentStatus as 'pending' | 'paid' | 'failed') || 'pending',
          items: OrderService.mapOrderItems(order.items),
        },
      },
    };
  }

  async handleStripeWebhook(payload: any, signature: string): Promise<void> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await this.orderRepository.updateOrderStatus(orderId, 'paid');
      }
    }
  }

  private static mapOrderItems(items: any[]): OrderItem[] {
    return items.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price),
      customizations:
        (item.customizations as Record<string, unknown>) || undefined,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        images: item.product.images,
      },
    }));
  }
}
