import { apiClient } from '@/lib/api/client';
import { createProductCache, createCategoryCache } from '@/lib/cache';
import type { Product, Category, ProductFilters } from '@/types/product';

// Local fallback categories using public assets to ensure UI renders even if API is unavailable
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 'engagement-rings',
    name: 'Engagement Rings',
    slug: 'engagement-rings',
    image: '/images/categories/engagement_rings.png',
    description: 'Timeless designs to celebrate your love.',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    slug: 'earrings',
    image: '/images/categories/Earrings.png',
    description: 'Elegant pieces for every occasion.',
  },
  {
    id: 'everyday',
    name: 'Everyday',
    slug: 'everyday',
    image: '/images/categories/everyday.png',
    description: 'Subtle jewelry for daily wear.',
  },
  {
    id: 'mangalsutra',
    name: 'Mangalsutra',
    slug: 'mangalsutra',
    image: '/images/categories/Mangalsutra.png',
    description: 'Tradition crafted with modern elegance.',
  },
];

// Cached server functions for product data
export const getProducts = createProductCache(
  async (filters?: ProductFilters): Promise<Product[]> => {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.category) queryParams.set('category', filters.category);
      if (filters?.minPrice)
        queryParams.set('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice)
        queryParams.set('maxPrice', filters.maxPrice.toString());
      if (filters?.inStock !== undefined)
        queryParams.set('inStock', filters.inStock.toString());
      if (filters?.search) queryParams.set('search', filters.search);

      const query = queryParams.toString();
      const endpoint = `/products${query ? `?${query}` : ''}`;

      const response = await apiClient.get<{
        success: boolean;
        data: {
          products: Product[];
          total: number;
          hasMore: boolean;
        };
      }>(endpoint);
      return response.success ? response.data.products : [];
    } catch (error) {
      return [];
    }
  },
  'products'
);

export const getProductById = async (id: string): Promise<Product | null> => {
  // Use internal Next.js API (now works with database)
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/products?id=${encodeURIComponent(id)}`, {
      cache: 'no-store', // Disable caching to avoid 2MB limit issues
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data?.product) return data.data.product as Product;
    }
  } catch (error) {
    console.error('Error fetching product from API:', error);
  }

  return null;
};

export const getCategories = createCategoryCache(
  async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Category[];
      }>('/categories');

      // Use API data when available, otherwise fallback to local assets
      if (
        response?.success &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return response.data;
      }
      return FALLBACK_CATEGORIES;
    } catch (error) {
      return FALLBACK_CATEGORIES;
    }
  }
);

export const getCategoryBySlug = (slug: string) =>
  createCategoryCache(async (): Promise<Category | null> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Category;
      }>(`/categories/${slug}`);
      return response.success ? response.data : null;
    } catch (error) {
      // Provide single fallback when possible
      return FALLBACK_CATEGORIES.find(c => c.slug === slug) ?? null;
    }
  });
