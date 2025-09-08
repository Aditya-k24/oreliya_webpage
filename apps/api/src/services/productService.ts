import { ProductRepository } from '../repositories/productRepository';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductSortOptions,
  ProductResponse,
  ProductsResponse,
  ProductStatsResponse,
  CategoriesResponse,
  TagsResponse,
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
        },
      },
    };
  }

  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSortOptions = {}
  ): Promise<ProductsResponse> {
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

  async getFeaturedProducts(): Promise<ProductsResponse> {
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
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getOnSaleProducts(): Promise<ProductsResponse> {
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
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getRelatedProducts(productId: string): Promise<ProductsResponse> {
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
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
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
        })),
        total: products.length,
        hasMore: false,
      },
    };
  }

  async getProductStats(): Promise<ProductStatsResponse> {
    const stats = await this.productRepository.getProductStats();

    return {
      success: true,
      data: { stats },
    };
  }

  async getCategories(): Promise<CategoriesResponse> {
    const categories = await this.productRepository.findCategories();

    return {
      success: true,
      data: { categories },
    };
  }

  async getTags(): Promise<TagsResponse> {
    const tags = await this.productRepository.findTags();

    return {
      success: true,
      data: { tags },
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
