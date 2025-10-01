import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import * as store from '@/lib/dev-products-store';
import { config } from '@/lib/config';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Remove from dev store immediately
    store.removeBySlug(slug);
    
    // Try to delete from actual database
    try {
      const session = await getServerSession(authOptions);
      const accessToken = (session as any)?.accessToken;
      
      if (!accessToken) {
        return NextResponse.json({
          success: true,
          message: 'Deleted from dev store. Sign in as admin for permanent deletion.'
        }, { status: 200 });
      }
      
      const response = await fetch(`${config.api.baseUrl}/products/slug/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok || response.status === 404) {
        return NextResponse.json({
          success: true,
          message: 'Product deleted successfully from database'
        }, { status: 200 });
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('API delete by slug failed:', response.status, errorData);
      
      return NextResponse.json({
        success: true,
        message: `Deleted from dev store. DB deletion failed: ${errorData.message}`
      }, { status: 200 });
      
    } catch (apiError) {
      console.error('API delete by slug error:', apiError);
      return NextResponse.json({
        success: true,
        message: 'Deleted from dev store. DB connection failed.'
      }, { status: 200 });
    }
    
  } catch (error) {
    console.error('Error deleting product by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
