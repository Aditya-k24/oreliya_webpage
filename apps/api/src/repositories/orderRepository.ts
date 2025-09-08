import { PrismaClient } from '@prisma/client';
import { CreateOrderRequest } from '../types/order';

export class OrderRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createOrder(
    userId: string,
    data: CreateOrderRequest,
    cartItems: any[]
  ) {
    // Generate order number
    const orderNumber = OrderRepository.generateOrderNumber();

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingAmount = 10; // Fixed shipping
    const discountAmount = 0; // Will be calculated based on deals
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    return this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        billingAddressId: data.billingAddressId,
        shippingAddressId: data.shippingAddressId,
        notes: data.notes,
        status: 'pending',
        paymentStatus: 'pending',
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations,
          })),
        },
      },
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
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  async updateOrderStripeSession(orderId: string, stripeSessionId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId,
      },
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
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  async updateOrderPaymentStatus(orderId: string, paymentStatus: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        status: paymentStatus === 'paid' ? 'processing' : 'pending',
      },
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
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
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
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  async getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
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
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  async getOrderByStripeSessionId(stripeSessionId: string) {
    return this.prisma.order.findUnique({
      where: { stripeSessionId },
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
        billingAddress: true,
        shippingAddress: true,
      },
    });
  }

  async getOrdersByUserId(userId: string) {
    return this.prisma.order.findMany({
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
        billingAddress: true,
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async validateStock(_productId: string, _quantity: number) {
    // For now, always return true since we don't have stock management
    // In a real application, you would check against a stock table
    return true;
  }

  private static generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORE-${timestamp}-${random}`;
  }
}
