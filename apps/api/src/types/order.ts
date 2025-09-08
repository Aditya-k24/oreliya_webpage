export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  customizations?: Record<string, unknown>;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  billingAddressId: string;
  shippingAddressId: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  stripeSessionId?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  billingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  shippingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
}

export interface CreateOrderRequest {
  billingAddressId: string;
  shippingAddressId: string;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
    checkoutUrl?: string; // Stripe checkout URL
  };
}

export interface OrderListResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      payment_status: string;
      metadata?: {
        orderId?: string;
      };
    };
  };
}
