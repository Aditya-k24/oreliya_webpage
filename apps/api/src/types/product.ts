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
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  variants: ProductVariant[];
  customizations: ProductCustomization[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductVariantRequest {
  size?: string;
  material?: string;
  price: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
}

export interface CreateProductCustomizationRequest {
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
  isEnabled?: boolean;
  sortOrder?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  salePercentage?: number;
  variants: CreateProductVariantRequest[];
  customizations: CreateProductCustomizationRequest[];
  metadata?: Record<string, unknown>;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  compareAtPrice?: number;
  images?: string[];
  category?: string;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  salePercentage?: number;
  metadata?: Record<string, unknown>;
  variants?: CreateProductVariantRequest[];
  customizations?: CreateProductCustomizationRequest[];
}

export interface ProductFilters {
  category?: string;
  tags?: string[];
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock?: boolean;
  search?: string;
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: ProductFilters;
    sort: ProductSortOptions;
  };
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export interface DealsResponse {
  success: boolean;
  data: {
    deals: Product[];
    featured: Product[];
  };
}
