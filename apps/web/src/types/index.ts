// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
  message?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  metadata?: Record<string, any>;
  variants: ProductVariant[];
  customizations: ProductCustomization[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  material?: string;
  price: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface ProductCustomization {
  id: string;
  name: string;
  type: 'text' | 'select' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];
  priceAdjustment?: number;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  customizations?: Record<string, any>;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  billingAddress: Address;
  shippingAddress: Address;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedVariant?: ProductVariant;
  customizations?: Record<string, any>;
}

// Address types
export interface Address {
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
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Admin types
export interface AdminStats {
  sales: Array<{
    createdAt: string;
    _sum: { totalAmount: number };
  }>;
  topProducts: Array<{
    productId: string;
    _sum: { quantity: number };
  }>;
  lowInventory: Array<{
    id: string;
    productId: string;
    size: string;
    material: string;
    stockQuantity: number;
  }>;
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  createdAt: string;
  updatedAt: string;
}
