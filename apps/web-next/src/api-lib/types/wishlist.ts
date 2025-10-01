export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    isOnSale: boolean;
    salePercentage?: number;
  };
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  totalItems: number;
}

export interface WishlistResponse {
  success: boolean;
  data: {
    wishlist: Wishlist;
  };
}
