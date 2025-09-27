import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/features/auth/lib/options';
import { config } from '@/lib/config';
import { createErrorResponse, AppError } from '@/lib/error-handler';

// In-memory storage for development mode
const products: any[] = [
  {
    id: '1',
    name: 'Solitaire Diamond Ring',
    description: 'Exquisite solitaire diamond engagement ring with 18k gold setting.',
    price: 125000,
    category: 'Engagement Rings',
    images: ['/images/categories/engagement_rings.png'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Gold Chain Necklace',
    description: 'Elegant 22k gold chain necklace perfect for daily wear.',
    price: 45000,
    category: 'Everyday Jewelry',
    images: ['/images/categories/everyday.png'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pearl Drop Earrings',
    description: 'Beautiful pearl drop earrings with diamond accents.',
    price: 35000,
    category: 'Earrings',
    images: ['/images/categories/Earrings.png'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Traditional Gold Mangalsutra',
    description: 'Classic gold mangalsutra with traditional design and cultural significance.',
    price: 55000,
    category: 'Mangalsutra',
    images: ['/images/categories/Mangalsutra.png'],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('id');
    
    // If requesting a specific product
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: product,
      });
    }

    // In production, fetch from actual API
    if (process.env.NODE_ENV === 'production') {
      const response = await fetch(`${config.api.baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new AppError('Failed to fetch products from API', response.status);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Return dynamic products array for development
    return NextResponse.json({
      success: true,
      data: {
        products: products,
        total: products.length,
      },
    });
  } catch (error) {
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, { 
      status: error instanceof AppError ? error.statusCode : 500 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session as any).user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // In production, fetch from actual API
    if (process.env.NODE_ENV === 'production') {
      const response = await fetch(`${config.api.baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).accessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Mock product creation for development
    const newProduct = {
      id: `product-${Date.now()}`,
      name: body.name || 'New Product',
      description: body.description || 'Product description',
      price: body.price || 0,
      category: body.category || 'Everyday Jewelry',
      images: body.images || [],
      inStock: body.inStock !== undefined ? body.inStock : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add the new product to the products array
    products.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
