export interface ProductCustomization {
  id: string;
  name: string;
  type: 'text' | 'image' | 'color' | 'select' | 'number';
  required: boolean;
  options?: string[];
  priceAdjustment?: number;
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
  pattern?: string;
  helpText?: string;
  category?: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
  inStock: boolean;
  customizations?: ProductCustomization[];
  compareAtPrice?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  salePercentage?: number;
  variants?: Array<{ stockQuantity: number }>;
  tags?: string[];
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}
