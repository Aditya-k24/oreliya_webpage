import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import * as store from '@/lib/dev-products-store';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';
import { getSignedUrls } from '@/lib/storage';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('id');
    
    // If requesting a specific product
    if (productId) {
      // 1) Check dev store first
      const dev = store.list().find(p => p.id === productId);
      if (dev) {
        const res = NextResponse.json({ success: true, data: { product: dev } }, { status: 200 });
        res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=30');
        return res;
      }

      // 2) Fetch from database
      try {
        const productRepository = new ProductRepository(prisma);
        const productService = new ProductService(productRepository);
        
        const result = await productService.getProductById(productId);
        
        if (result.success && result.data?.product) {
          const res = NextResponse.json({ success: true, data: { product: result.data.product } }, { status: 200 });
          res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=30');
          return res;
        }
      } catch (dbError) {
        console.error('Database fetch error:', dbError);
      }

      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // List all products from database
    try {
      const productRepository = new ProductRepository(prisma);
      const productService = new ProductService(productRepository);
      
      const result = await productService.getProducts();
      
      if (result.success && result.data?.products) {
        // Merge with dev store for immediate visibility, removing duplicates
        const dbProducts = result.data.products;
        const devProducts = store.list();
        
        // Create a map to deduplicate by ID
        const productMap = new Map();
        
        // Add database products first
        dbProducts.forEach(product => {
          productMap.set(product.id, product);
        });
        
        // Add dev store products, but only if they don't exist in database
        devProducts.forEach(product => {
          if (!productMap.has(product.id)) {
            productMap.set(product.id, product);
          }
        });
        
        const merged = Array.from(productMap.values());
        
        // Batch generate signed URLs for all product images in one API call
        const allImagePaths = merged.flatMap(p => p.images || []);
        const urlMap = allImagePaths.length > 0 
          ? await getSignedUrls('production', allImagePaths, 7200)
          : new Map();
        
        const productsWithSignedUrls = merged.map(product => {
          if (product.images && product.images.length > 0) {
            const signedImages = product.images.map((path: string) => urlMap.get(path) || path);
            return { ...product, images: signedImages };
          }
          return product;
        });
        
        const res = NextResponse.json({
          success: true,
          data: { products: productsWithSignedUrls, total: productsWithSignedUrls.length },
        }, { status: 200 });
        res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=30');
        return res;
      }
    } catch (dbError) {
      console.error('Database fetch error:', dbError);
    }

    // Fallback to dev store only
    const devProducts = store.list();
    const res = NextResponse.json({
      success: true,
      data: { products: devProducts, total: devProducts.length },
    }, { status: 200 });
    res.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=30');
    return res;
    
  } catch (error) {
    console.error('Error in products GET:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = (session as { user?: { role?: string } })?.user?.role;
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Create product directly in database using ProductService
    try {
      // Verify Prisma client is available
      if (!prisma) {
        console.error('Prisma client is undefined');
        return NextResponse.json(
          { success: false, message: 'Database client not available' },
          { status: 500 }
        );
      }
      
      if (typeof prisma.products === 'undefined') {
        console.error('Prisma products model is undefined. Available models:', Object.keys(prisma));
        return NextResponse.json(
          { success: false, message: 'Database model not available' },
          { status: 500 }
        );
      }

      const productRepository = new ProductRepository(prisma);
      const productService = new ProductService(productRepository);
      
      const result = await productService.createProduct(body);
      
      // Also add to dev store for immediate visibility
      if (result.data?.product) {
        const devProduct = {
          ...result.data.product,
          createdAt: result.data.product.createdAt.toISOString(),
          updatedAt: result.data.product.updatedAt.toISOString(),
        };
        store.add(devProduct);
      }
      
      return NextResponse.json(result, { status: 201 });
      
    } catch (dbError) {
      console.error('Database create error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to create product in database' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
