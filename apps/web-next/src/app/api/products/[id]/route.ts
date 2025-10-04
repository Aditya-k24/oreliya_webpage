export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import * as store from '@/lib/dev-products-store';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to get product from database first
    try {
      const productRepository = new ProductRepository(prisma);
      const productService = new ProductService(productRepository);
      
      const result = await productService.getProductById(id);
      
      if (result.success && result.data) {
        // Generate signed URLs for images
        const product = result.data.product;
        if (product.images && product.images.length > 0) {
          const { getSignedUrls } = await import('@/lib/storage');
          const urlMap = await getSignedUrls('production', product.images, 7200);
          product.images = product.images.map((path: string) => urlMap.get(path) || path);
        }
        
        return NextResponse.json({
          success: true,
          data: product
        }, { status: 200 });
      }
    } catch (dbError) {
      console.error('Database fetch error:', dbError);
    }
    
    // Fallback to dev store
    const product = store.getById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT API - Product ID:', id);
    
    // Check authentication first
    const session = await getServerSession(authOptions);
    console.log('PUT API - Session:', session);
    
    if (!session) {
      console.log('PUT API - No session found');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = (session as any)?.user?.role;
    console.log('PUT API - User role:', userRole);
    if (userRole !== 'admin') {
      console.log('PUT API - User is not admin');
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('PUT API - Request body:', body);
    
    // Check if product exists in dev store first
    const existingProduct = store.getById(id);
    console.log('PUT API - Existing product in dev store:', existingProduct);
    
    // Update in dev store immediately for instant UI update
    const updatedProduct = store.updateById(id, {
      ...body,
      id,
      updatedAt: new Date().toISOString()
    });
    console.log('PUT API - Updated product from dev store:', updatedProduct);
    
    if (!updatedProduct) {
      console.log('PUT API - Product not found in dev store, will try database update');
    }
    
    // Update in database using ProductService
    try {
      const productRepository = new ProductRepository(prisma);
      const productService = new ProductService(productRepository);
      
      const result = await productService.updateProduct(id, body);
      
      if (result.success) {
        // If dev store update failed but database update succeeded, add to dev store
        if (!updatedProduct) {
          const newProduct = {
            ...body,
            id,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          };
          store.add(newProduct);
          console.log('PUT API - Added product to dev store after database update');
        }
        
        return NextResponse.json({
          success: true,
          data: result.data.product,
          message: 'Product updated successfully in database'
        }, { status: 200 });
      } else {
        throw new Error('ProductService update failed');
      }
      
    } catch (dbError) {
      console.error('Database update error:', dbError);
      
      // If dev store update succeeded but database failed, return dev store data
      if (updatedProduct) {
        return NextResponse.json({
          success: true,
          data: updatedProduct,
          message: 'Updated in dev store. Database update failed.'
        }, { status: 200 });
      } else {
        // Both dev store and database failed
        return NextResponse.json({
          success: false,
          message: 'Product not found in dev store and database update failed'
        }, { status: 404 });
      }
    }
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    
    // Remove from dev store immediately for instant UI update
    store.removeById(id);
    
    // Delete from database using ProductService
    try {
      const productRepository = new ProductRepository(prisma);
      const productService = new ProductService(productRepository);
      
      await productService.deleteProduct(id);
      
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully from database'
      }, { status: 200 });
      
    } catch (dbError) {
      console.error('Database delete error:', dbError);
      return NextResponse.json({
        success: true,
        message: 'Deleted from dev store. Database deletion failed.'
      }, { status: 200 });
    }
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
