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
        merged = merged.filter((product: any) => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      const allImagePaths = merged.flatMap((p: any) => p.images || []);
      
      // Only get signed URLs if there are images to process
      let urlMap = new Map();
      if (allImagePaths.length > 0) {
        urlMap = await getSignedUrls('production', allImagePaths, 7200);
      }
      
      const productsWithSignedUrls = merged.map((product: any) => ({
        ...product,
        images: product.images && product.images.length > 0
          ? product.images.map((path: string) => urlMap.get(path) || path)
          : [],
        inStock: product.isActive,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));
      
      return productsWithSignedUrls;
    }
    
    const devProducts = store.list();
    const filteredDevProducts = category 
      ? devProducts.filter((product: any) => product.category.toLowerCase() === category.toLowerCase())
      : devProducts;
    
    return filteredDevProducts as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category || '';
  const products = await getServerProducts(category);
  
  return <ProductsPageClient initialProducts={products} initialCategory={category} />;
}

