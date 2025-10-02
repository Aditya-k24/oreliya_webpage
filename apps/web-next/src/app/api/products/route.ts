import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import * as store from '@/lib/dev-products-store';
import { config } from '@/lib/config';
import { createErrorResponse, AppError } from '@/lib/error-handler';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('id');
    
    // If requesting a specific product
    if (productId) {
      // 1) Check dev store first
      const dev = store.list().find(p => p.id === productId);
      if (dev) {
        return NextResponse.json({ success: true, data: { product: dev } }, { status: 200 });
      }

      // 2) Fallback to API
      const response = await fetch(`${config.api.baseUrl}/products/id/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (!response) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // List all: merge API results with dev store so newly added items appear immediately
    let apiProducts: any[] = [];
    try {
      const response = await fetch(`${config.api.baseUrl}/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        apiProducts = data?.data?.products ?? [];
      }
    } catch {}

    const merged = [...apiProducts, ...store.list()];
    return NextResponse.json({
      success: true,
      data: { products: merged, total: merged.length },
    }, { status: 200 });
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
    const userRole = (session as any)?.user?.role;
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Create product directly in database using ProductService
    try {
      const productRepository = new ProductRepository(prisma);
      const productService = new ProductService(productRepository);
      
      const result = await productService.createProduct(body);
      
      // Also add to dev store for immediate visibility
      if (result.data?.product) {
        store.add(result.data.product);
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
