import { ProductRepository } from '../repositories/productRepository';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductSortOptions,
  ProductResponse,
  ProductVariant,
  ProductCustomization,
} from '../types/product';
import { CustomError } from '../utils/errors';

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    const product = await this.productRepository.createProduct(data);

    return {
      success: true,
      data: {
        product: {
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        },
      },
    };
  }

  async getProductById(id: string): Promise<ProductResponse> {
    const product = await this.productRepository.getProductById(id);

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    return {
      success: true,
      data: {
        product: {
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        },
      },
    };
  }

  async getProductBySlug(slug: string): Promise<ProductResponse> {
    const product = await this.productRepository.getProductBySlug(slug);

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    return {
      success: true,
      data: {
        product: {
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        },
      },
    };
  }

  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSortOptions = { field: 'createdAt', order: 'desc' }
  ): Promise<{
    success: boolean;
    data: { products: any[]; total: number; hasMore: boolean };
  }> {
    const { products, total, hasMore } =
      await this.productRepository.getProducts(filters, sort);

    return {
      success: true,
      data: {
        products: products.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total,
        hasMore,
      },
    };
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<ProductResponse> {
    const existingProduct = await this.productRepository.getProductById(id);

    if (!existingProduct) {
      throw new CustomError('Product not found', 404);
    }

    const product = await this.productRepository.updateProduct(id, data);

    return {
      success: true,
      data: {
        product: {
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        },
      },
    };
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const existingProduct = await this.productRepository.getProductById(id);

    if (!existingProduct) {
      throw new CustomError('Product not found', 404);
    }

    await this.productRepository.deleteProduct(id);

    return { success: true };
  }

  async getFeaturedProducts(): Promise<{
    success: boolean;
    data: { products: any[]; total: number; hasMore: boolean };
  }> {
    const products = await this.productRepository.getFeaturedProducts();

    return {
      success: true,
      data: {
        products: products.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getOnSaleProducts(): Promise<{
    success: boolean;
    data: { products: any[]; total: number; hasMore: boolean };
  }> {
    const products = await this.productRepository.getOnSaleProducts();

    return {
      success: true,
      data: {
        products: products.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getDealsAndFeatured(): Promise<{
    success: boolean;
    data: { featured: any[]; deals: any[] };
  }> {
    const [featuredProducts, onSaleProducts] = await Promise.all([
      this.productRepository.getFeaturedProducts(),
      this.productRepository.getOnSaleProducts(),
    ]);

    return {
      success: true,
      data: {
        featured: featuredProducts.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        deals: onSaleProducts.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
      },
    };
  }

  async getRelatedProducts(productId: string): Promise<{
    success: boolean;
    data: { products: any[]; total: number; hasMore: boolean };
  }> {
    const products = await this.productRepository.getRelatedProducts(productId);

    return {
      success: true,
      data: {
        products: products.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async searchProducts(query: string): Promise<{
    success: boolean;
    data: { products: any[]; total: number; hasMore: boolean };
  }> {
    const products = await this.productRepository.searchProducts(query);

    return {
      success: true,
      data: {
        products: products.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants((product as any).variants || []),
          customizations: ProductService.mapCustomizations(
            (product as any).customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getProductStats(): Promise<{ success: boolean; data: { stats: any } }> {
    const stats = await this.productRepository.getProductStats();

    return {
      success: true,
      data: { stats },
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
      data: { tags },
    };
  }

  private static mapVariants(variants: unknown[]): ProductVariant[] {
    return variants.map((variant: unknown) => {
      const v = variant as any;
      return {
        id: v.id,
        size: v.size || undefined,
        material: v.material || undefined,
        price: Number(v.price),
        stockQuantity: v.stockQuantity,
        sku: v.sku,
        isActive: v.isActive,
      };
    });
  }

  private static mapCustomizations(
    customizations: unknown[]
  ): ProductCustomization[] {
    return customizations.map((customization: unknown) => {
      const c = customization as any;
      return {
        id: c.id,
        name: c.attribute,
        type: c.type as 'text' | 'image' | 'color' | 'select' | 'number',
        required: c.required,
        options: c.options || undefined,
        priceAdjustment: c.priceAdjustment
          ? Number(c.priceAdjustment)
          : undefined,
        minValue: c.minValue || undefined,
        maxValue: c.maxValue || undefined,
        maxLength: c.maxLength || undefined,
        pattern: c.pattern || undefined,
        helpText: c.helpText || undefined,
        category: c.category || undefined,
        isEnabled: c.isEnabled ?? true,
        sortOrder: c.sortOrder || 0,
      };
    });
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
