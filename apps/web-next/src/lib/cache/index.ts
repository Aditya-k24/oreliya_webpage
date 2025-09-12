import { unstable_cache } from 'next/cache';

export interface CacheOptions {
  revalidate?: number | false;
  tags?: string[];
}

export function createCachedFetch<T>(
  fetcher: () => Promise<T>,
  key: string,
  options: CacheOptions = {}
) {
  return unstable_cache(fetcher, [key], {
    revalidate: options.revalidate ?? 300, // 5 minutes default
    tags: options.tags ?? [],
  });
}

export function createProductCache<T>(
  fetcher: () => Promise<T>,
  category?: string
) {
  const key = category ? `products-${category}` : 'products';
  return createCachedFetch(fetcher, key, {
    revalidate: 600, // 10 minutes for products
    tags: ['products'],
  });
}

export function createCategoryCache<T>(fetcher: () => Promise<T>) {
  return createCachedFetch(fetcher, 'categories', {
    revalidate: 3600, // 1 hour for categories
    tags: ['categories'],
  });
}
