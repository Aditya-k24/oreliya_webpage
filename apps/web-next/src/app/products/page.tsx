import { unstable_cache } from 'next/cache';
import ProductsPageClient from './ProductsPageClient';
import type { Product } from '@/types/product';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';
import { getSignedUrls } from '@/lib/storage';
import * as store from '@/lib/dev-products-store';

async function getServerProducts(category?: string): Promise<Product[]> {
  try {
    const productRepository = new ProductRepository(prisma);
    const productService = new ProductService(productRepository);

    const result = await productService.getProducts();

    if (result.success && result.data?.products) {
      const dbProducts = result.data.products;
      const devProducts = store.list();

      const productMap = new Map<string, any>();

      dbProducts.forEach((product: any) => {
        productMap.set(product.id, product);
      });

      devProducts.forEach((product: any) => {
        if (!productMap.has(product.id)) {
          productMap.set(product.id, product);
        }
      });

      let merged = Array.from(productMap.values());

      // Filter by category at server level for better performance
      if (category) {
        if (category === 'special-offer-rings') {
          // Filter for rings with price exactly 5999
          merged = merged.filter(
            (product: any) =>
              product.category.toLowerCase() === 'rings' &&
              parseFloat(product.price) === 5999
          );
        } else {
          merged = merged.filter(
            (product: any) =>
              product.category.toLowerCase() === category.toLowerCase()
          );
        }
      }

      // Normalize each image entry to a raw storage path.
      // Products uploaded via the admin panel store the full signed URL in the DB
      // (e.g. https://…supabase.co/storage/v1/object/sign/production/products/img.jpg?token=…).
      // We strip it back to the raw path so we can generate a fresh signed URL.
      const normalizeToPath = (img: string): string => {
        if (img.includes('/storage/v1/object/sign/production/')) {
          return img
            .split('/storage/v1/object/sign/production/')[1]
            .split('?')[0];
        }
        // Already a raw path
        return img;
      };

      // Build a parallel array of raw paths (one per image, preserving order)
      const allRawPaths = merged.flatMap((p: any) =>
        (p.images || []).map(normalizeToPath)
      );

      // Only get signed URLs if there are images to process
      let urlMap = new Map<string, string>();
      if (allRawPaths.length > 0) {
        urlMap = await getSignedUrls(
          'production',
          [...new Set(allRawPaths)],
          7200
        );
      }

      const productsWithSignedUrls = merged.map((product: any) => ({
        ...product,
        images:
          product.images && product.images.length > 0
            ? product.images.map((img: string) => {
                const raw = normalizeToPath(img);
                return urlMap.get(raw) || img;
              })
            : [],
        inStock: product.isActive,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));

      return productsWithSignedUrls;
    }

    const devProducts = store.list();
    const filteredDevProducts = category
      ? devProducts.filter(
          (product: any) =>
            product.category.toLowerCase() === category.toLowerCase()
        )
      : devProducts;

    return filteredDevProducts as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

const getCachedProducts = unstable_cache(
  (category: string) => getServerProducts(category),
  ['products'],
  { revalidate: 600, tags: ['products'] }
);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || '';
  const products = await getCachedProducts(category);

  return (
    <ProductsPageClient initialProducts={products} initialCategory={category} />
  );
}
