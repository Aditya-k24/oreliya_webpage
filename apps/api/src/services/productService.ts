import { Decimal } from '@prisma/client/runtime/library';
import { ProductRepository } from '../repositories/productRepository';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductSortOptions,
  ProductQueryParams,
  ProductListResponse,
  ProductResponse,
  DealsResponse,
} from '../types/product';
import { CustomError } from '../utils/errors';

function convertDecimalToNumber(obj: any): any {
  if (obj instanceof Decimal) return obj.toNumber();
  if (Array.isArray(obj)) return obj.map(convertDecimalToNumber);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertDecimalToNumber(v)])
    );
  }
  return obj;
}

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      throw new CustomError('Missing required fields', 400);
    }

    // Validate price
    if (data.price <= 0) {
      throw new CustomError('Price must be greater than 0', 400);
    }

    // Validate variants
    if (data.variants && data.variants.length > 0) {
      const invalidVariant = data.variants.find(
        variant => variant.price <= 0 || variant.stockQuantity < 0
      );
      if (invalidVariant) {
        if (invalidVariant.price <= 0) {
          throw new CustomError('Variant price must be greater than 0', 400);
        }
        throw new CustomError('Stock quantity cannot be negative', 400);
      }
    }

    const product = await this.productRepository.create(data);

    return {
      success: true,
      data: { product: convertDecimalToNumber(product) },
    };
  }

  async getProductById(id: string): Promise<ProductResponse> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    return {
      success: true,
      data: { product: convertDecimalToNumber(product) },
    };
  }

  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    return {
      success: true,
      data: { product: convertDecimalToNumber(product) },
    };
  }

  async getProducts(
    queryParams: ProductQueryParams
  ): Promise<ProductListResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      tags,
      priceMin,
      priceMax,
      isActive,
      isFeatured,
      isOnSale,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = queryParams;

    // Validate pagination
    if (page < 1) {
      throw new CustomError('Page must be greater than 0', 400);
    }
    if (limit < 1 || limit > 100) {
      throw new CustomError('Limit must be between 1 and 100', 400);
    }

    // Parse tags
    const parsedTags = tags
      ? tags.split(',').map(tag => tag.trim())
      : undefined;

    // Build filters
    const filters: ProductFilters = {
      search,
      category,
      tags: parsedTags,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      isActive,
      isFeatured,
      isOnSale,
      inStock,
    };

    // Build sort options
    const sort: ProductSortOptions = {
      field: ProductService.validateSortField(sortBy),
      order: sortOrder === 'asc' ? 'asc' : 'desc',
    };

    const { products, total } = await this.productRepository.findAll(
      filters,
      sort,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        products: products.map(convertDecimalToNumber),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters,
        sort,
      },
    };
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<ProductResponse> {
    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new CustomError('Product not found', 404);
    }

    // Validate price if provided
    if (data.price !== undefined && data.price <= 0) {
      throw new CustomError('Price must be greater than 0', 400);
    }

    // Validate variants if provided
    if (data.variants && data.variants.length > 0) {
      const invalidVariant = data.variants.find(
        variant => variant.price <= 0 || variant.stockQuantity < 0
      );
      if (invalidVariant) {
        if (invalidVariant.price <= 0) {
          throw new CustomError('Variant price must be greater than 0', 400);
        }
        throw new CustomError('Stock quantity cannot be negative', 400);
      }
    }

    const product = await this.productRepository.update(id, data);

    return {
      success: true,
      data: { product: convertDecimalToNumber(product) },
    };
  }

  async deleteProduct(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new CustomError('Product not found', 404);
    }

    await this.productRepository.delete(id);

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  async getDealsAndFeatured(): Promise<DealsResponse> {
    const [deals, featured] = await Promise.all([
      this.productRepository.findDeals(),
      this.productRepository.findFeatured(),
    ]);

    return {
      success: true,
      data: {
        deals: deals.map(convertDecimalToNumber),
        featured: featured.map(convertDecimalToNumber),
      },
    };
  }

  async getCategories(): Promise<{
    success: boolean;
    data: { categories: string[] };
  }> {
    const categories = await this.productRepository.findCategories();

    return {
      success: true,
      data: { categories },
    };
  }

  async getTags(): Promise<{ success: boolean; data: { tags: string[] } }> {
    const tags = await this.productRepository.findTags();

    return {
      success: true,
      data: { tags: tags as string[] },
    };
  }

  private static validateSortField(
    field: string
  ): 'name' | 'price' | 'createdAt' | 'updatedAt' {
    const validFields = ['name', 'price', 'createdAt', 'updatedAt'];
    if (!validFields.includes(field)) {
      return 'createdAt';
    }
    return field as 'name' | 'price' | 'createdAt' | 'updatedAt';
  }
}
