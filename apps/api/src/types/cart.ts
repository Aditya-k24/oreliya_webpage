export interface CartItem {
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

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  customizations?: Record<string, unknown>;
}

export interface UpdateCartItemRequest {
  quantity: number;
  customizations?: Record<string, unknown>;
}

export interface CartResponse {
  success: boolean;
  data: {
    cart: Cart;
  };
}
