import { PrismaClient, Prisma } from '@prisma/client';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductSortOptions,
} from '../types/product';

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createProduct(data: CreateProductRequest) {
    return this.prisma.product.create({
      data: {
        ...data,
        tags: data.tags || [],
        metadata: data.metadata || {},
      },
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
    });
  }

  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSortOptions = {}
  ) {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      tags,
      isActive,
      isFeatured,
      isOnSale,
    } = filters;

    const {
      field = 'createdAt',
      order = 'desc',
      limit = 20,
      offset = 0,
    } = sort;

    const where: Prisma.ProductWhereInput = {
      isActive: isActive ?? true,
      ...(category && { category }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags &&
        tags.length > 0 && {
          tags: { hasSome: tags },
        }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isOnSale !== undefined && { isOnSale }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [field]: order,
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      hasMore: offset + limit < total,
    };
  }

  async updateProduct(id: string, data: UpdateProductRequest) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(data.tags && { tags: data.tags }),
        ...(data.metadata && { metadata: data.metadata }),
      },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getFeaturedProducts(limit = 10) {
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOnSaleProducts(limit = 10) {
    return this.prisma.product.findMany({
      where: { isActive: true, isOnSale: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelatedProducts(productId: string, limit = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { category: true, tags: true },
    });

    if (!product) return [];

    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        OR: [
          { category: product.category },
          { tags: { hasSome: product.tags } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchProducts(query: string, limit = 20) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductStats() {
    const [total, active, featured, onSale] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isFeatured: true } }),
      this.prisma.product.count({ where: { isOnSale: true } }),
    ]);

    return { total, active, featured, onSale };
  }

  async findCategories() {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      where: { isActive: true },
      distinct: ['category'],
    });
    return categories.map((c: any) => c.category);
  }

  async findTags(): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      select: { tags: true },
      where: { isActive: true },
    });
    const allTags = products.flatMap((p: any) => p.tags);
    return [...new Set(allTags)];
  }

  private static generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
