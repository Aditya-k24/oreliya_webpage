import { apiClient } from '@/lib/api/client';
import { createProductCache, createCategoryCache } from '@/lib/cache';
import type { Product, Category, ProductFilters } from '@/types/product';

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
        data: Product[];
      }>(endpoint);
      return response.success ? response.data : [];
    } catch (error) {
      return [];
    }
  },
  'products'
);

export const getProductById = (id: string) =>
  createProductCache(async (): Promise<Product | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Product }>(
        `/products/${id}`
      );
      return response.success ? response.data : null;
    } catch (error) {
      return null;
    }
  }, `product-${id}`)();

export const getCategories = createCategoryCache(
  async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Category[];
      }>('/categories');
      return response.success ? response.data : [];
    } catch (error) {
      return [];
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
      return null;
    }
  });
