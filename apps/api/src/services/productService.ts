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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        },
      },
    };
  }

  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSortOptions = { field: 'createdAt', order: 'desc' }
  ): Promise<any> {
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
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

  async getFeaturedProducts(): Promise<any> {
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getOnSaleProducts(): Promise<any> {
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getDealsAndFeatured(): Promise<any> {
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        deals: onSaleProducts.map(product => ({
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
      },
    };
  }

  async getRelatedProducts(productId: string): Promise<any> {
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async searchProducts(query: string): Promise<any> {
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
          variants: ProductService.mapVariants(product.variants || []),
          customizations: ProductService.mapCustomizations(
            product.customizations || []
          ),
          metadata: (product.metadata as Record<string, unknown>) || {},
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getProductStats(): Promise<any> {
    const stats = await this.productRepository.getProductStats();

    return {
      success: true,
      data: { stats },
    };
  }

  async getCategories(): Promise<any> {
    const categories = await this.productRepository.findCategories();

    return {
      success: true,
      data: { categories },
    };
  }

  async getTags(): Promise<any> {
    const tags = await this.productRepository.findTags();

    return {
      success: true,
      data: { tags },
    };
  }

  private static mapVariants(variants: any[]): ProductVariant[] {
    return variants.map(variant => ({
      id: variant.id,
      size: variant.size || undefined,
      material: variant.material || undefined,
      price: Number(variant.price),
      stockQuantity: variant.stockQuantity,
      sku: variant.sku,
      isActive: variant.isActive,
    }));
  }

  private static mapCustomizations(
    customizations: any[]
  ): ProductCustomization[] {
    return customizations.map(customization => ({
      id: customization.id,
      name: customization.name,
      type: customization.type as 'text' | 'image' | 'color' | 'select',
      required: customization.required,
      options: customization.options || undefined,
      priceAdjustment: customization.priceAdjustment
        ? Number(customization.priceAdjustment)
        : undefined,
    }));
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
