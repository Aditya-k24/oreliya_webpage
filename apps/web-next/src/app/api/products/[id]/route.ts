export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import * as store from '@/lib/dev-products-store';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';

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
