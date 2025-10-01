import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import * as store from '@/lib/dev-products-store';
import { config } from '@/lib/config';
import { createErrorResponse, AppError } from '@/lib/error-handler';

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
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, { 
      status: error instanceof AppError ? error.statusCode : 500 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Try to create in actual database first
    try {
      const session = await getServerSession(authOptions);
      const accessToken = (session as any)?.accessToken;
      
      if (!accessToken) {
        // No session - create in dev store only
        const devProduct = {
          id: `product-${Date.now()}`,
          name: body.name || 'New Product',
          description: body.description || 'Product description',
          price: body.price || 0,
          category: body.category || 'other',
          images: body.images || [],
          customizations: Array.isArray(body.customizations) ? body.customizations : [],
          inStock: body.inStock !== undefined ? body.inStock : true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slug: body.slug || `product-${Date.now()}`,
        } as any;
        store.add(devProduct);
        return NextResponse.json({ 
          success: true, 
          data: devProduct,
          message: 'Created in dev store. Sign in as admin to save to database.'
        }, { status: 201 });
      }
      
      // Create in actual database via Express API
      const response = await fetch(`${config.api.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Also add to dev store for immediate visibility
        if (data.data) {
          store.add(data.data);
        }
        return NextResponse.json(data, { status: 201 });
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('API create failed:', response.status, errorData);
      
      // Fall back to dev store
      const devProduct = {
        id: `product-${Date.now()}`,
        name: body.name || 'New Product',
        description: body.description || 'Product description',
        price: body.price || 0,
        category: body.category || 'other',
        images: body.images || [],
        customizations: Array.isArray(body.customizations) ? body.customizations : [],
        inStock: body.inStock !== undefined ? body.inStock : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: body.slug || `product-${Date.now()}`,
      } as any;
      store.add(devProduct);
      return NextResponse.json({ 
        success: true, 
        data: devProduct,
        message: `Created in dev store. DB save failed: ${errorData.message}`
      }, { status: 201 });
      
    } catch (apiError) {
      console.error('API create error:', apiError);
      // Fall back to dev store
      const devProduct = {
        id: `product-${Date.now()}`,
        name: body.name || 'New Product',
        description: body.description || 'Product description',
        price: body.price || 0,
        category: body.category || 'other',
        images: body.images || [],
        customizations: Array.isArray(body.customizations) ? body.customizations : [],
        inStock: body.inStock !== undefined ? body.inStock : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: body.slug || `product-${Date.now()}`,
      } as any;
      store.add(devProduct);
      return NextResponse.json({ 
        success: true, 
        data: devProduct,
        message: 'Created in dev store. DB connection failed.'
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
