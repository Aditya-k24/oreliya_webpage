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
    cartRepository: CartRepository
  ) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
    });
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
            images: item.product.images,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=true`,
      metadata: {
        orderId: order.id,
        userId,
      },
    });

    // Update order with Stripe session ID
    const updatedOrder = await this.orderRepository.updateOrderStripeSession(
      order.id,
      session.id
    );

    // Clear cart after successful order creation
    await this.cartRepository.clearCart(cart.id);

    return {
      success: true,
      data: {
        order: updatedOrder as any,
        checkoutUrl: session.url!,
      },
    };
  }

  async getOrderById(orderId: string, userId: string): Promise<OrderResponse> {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order) {
      throw new CustomError('Order not found', 404);
    }

    if (order.userId !== userId) {
      throw new CustomError('Unauthorized', 403);
    }

    return {
      success: true,
      data: {
        order: order as any,
      },
    };
  }

  async getOrdersByUserId(
    userId: string
  ): Promise<{ success: boolean; data: { orders: any[] } }> {
    const orders = await this.orderRepository.getOrdersByUserId(userId);

    return {
      success: true,
      data: {
        orders: orders as any[],
      },
    };
  }

  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case 'payment_intent.succeeded':
        await OrderService.handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      case 'payment_intent.payment_failed':
        await OrderService.handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      throw new Error('No order ID in session metadata');
    }

    await this.orderRepository.updateOrderPaymentStatus(orderId, 'paid');
  }

  private static async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    // Handle payment intent success if needed
    console.log('Payment intent succeeded:', paymentIntent.id);
  }

  private static async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    // Handle payment intent failure if needed
    console.log('Payment intent failed:', paymentIntent.id);
  }
}
