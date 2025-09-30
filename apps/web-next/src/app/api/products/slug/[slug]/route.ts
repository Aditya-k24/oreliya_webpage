import { NextRequest, NextResponse } from 'next/server';
import * as store from '@/lib/dev-products-store';
// Dev: no-auth delete to unblock admin testing (also remove from dev store if present)

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const removed = store.removeBySlug(slug);
    console.log(`Deleting product with slug ${slug} (dev mode), removedFromStore=${removed}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
