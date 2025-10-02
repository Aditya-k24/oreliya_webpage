import { PrismaClient, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
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
    // Generate slug from name
    const slug = ProductRepository.generateSlug(data.name);
    const { customizations, ...productData } = data;

    return this.prisma.products.create({
      data: {
        ...productData,
        id: randomUUID(),
        slug,
        updatedAt: new Date(),
        category: data.category as any,
        metadata: data.metadata as any,
        // Create customizations if provided
        product_customizations: customizations
          ? {
              create: customizations.map(
                customization =>
                  ({
                    id: randomUUID(),
                    attribute: customization.name,
                    type: customization.type,
                    required: customization.required,
                    options: customization.options || [],
                    priceAdjustment: customization.priceAdjustment,
                    minValue: customization.minValue,
                    maxValue: customization.maxValue,
                    maxLength: customization.maxLength,
                    pattern: customization.pattern,
                    helpText: customization.helpText,
                    category: customization.category,
                    isEnabled: customization.isEnabled ?? true,
                    sortOrder: customization.sortOrder || 0,
                    updatedAt: new Date(),
                  }) as any
              ),
            }
          : undefined,
        // Don't include product_variants in create - they should be created separately
        product_variants: undefined,
      },
      include: {
        product_variants: true,
        product_customizations: true,
      },
    });
  }

  async getProductById(id: string) {
    return this.prisma.products.findUnique({
      where: { id },
      include: {
        product_variants: true,
        product_customizations: true,
      },
    });
  }

  async getProductBySlug(slug: string) {
    return this.prisma.products.findUnique({
      where: { slug },
      include: {
        product_variants: true,
        product_customizations: true,
      },
    });
  }

  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSortOptions = { field: 'createdAt', order: 'desc' },
    limit = 20,
    offset = 0
  ) {

    const where: Prisma.productsWhereInput = {
      isActive: filters.isActive ?? true,
      ...(filters.category && { category: filters.category as any }),
      ...(filters.tags && { tags: { hasSome: filters.tags } }),
      ...(filters.priceMin && { price: { gte: filters.priceMin } }),
      ...(filters.priceMax && { price: { lte: filters.priceMax } }),
      ...(filters.isFeatured && { isFeatured: true }),
      ...(filters.isOnSale && { isOnSale: true }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.products.findMany({
        where,
        include: {
          product_variants: true,
          product_customizations: true,
        },
        orderBy: { [sort.field]: sort.order },
        take: limit,
        skip: offset,
      }),
      this.prisma.products.count({ where }),
    ]);

    return {
      products,
      total,
      hasMore: offset + limit < total,
    };
  }

  async updateProduct(id: string, data: UpdateProductRequest) {
    const { customizations, ...productData } = data;
    
    return this.prisma.products.update({
      where: { id },
      data: {
        ...productData,
        updatedAt: new Date(),
        category: data.category as any,
        metadata: data.metadata as any,
        // Update customizations if provided
        product_customizations: customizations
          ? {
              deleteMany: {}, // Delete all existing customizations
              create: customizations.map(
                customization =>
                  ({
                    id: randomUUID(),
                    attribute: customization.name,
                    type: customization.type,
                    required: customization.required,
                    options: customization.options || [],
                    priceAdjustment: customization.priceAdjustment,
                    minValue: customization.minValue,
                    maxValue: customization.maxValue,
                    maxLength: customization.maxLength,
                    pattern: customization.pattern,
                    helpText: customization.helpText,
                    category: customization.category,
                    isEnabled: customization.isEnabled ?? true,
                    sortOrder: customization.sortOrder || 0,
                    updatedAt: new Date(),
                  }) as any
              ),
            }
          : undefined,
        // Don't include product_variants in update - they should be updated separately
        product_variants: undefined,
      },
      include: {
        product_variants: true,
        product_customizations: true,
      },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.products.delete({
      where: { id },
    });
  }

  async getFeaturedProducts() {
    return this.prisma.products.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        product_variants: true,
        product_customizations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOnSaleProducts() {
    return this.prisma.products.findMany({
      where: { isOnSale: true, isActive: true },
      include: {
        product_variants: true,
        product_customizations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      select: { category: true },
    });

    if (!product) return [];

    return this.prisma.products.findMany({
      where: {
        category: product.category,
        id: { not: productId },
        isActive: true,
      },
      include: {
        product_variants: true,
        product_customizations: true,
      },
      take: 4,
    });
  }

  async searchProducts(query: string) {
    return this.prisma.products.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        product_variants: true,
        product_customizations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductStats() {
    const [total, active, featured, onSale] = await Promise.all([
      this.prisma.products.count(),
      this.prisma.products.count({ where: { isActive: true } }),
      this.prisma.products.count({ where: { isFeatured: true } }),
      this.prisma.products.count({ where: { isOnSale: true } }),
    ]);

    return { total, active, featured, onSale };
  }

  async findCategories(): Promise<string[]> {
    const products = await this.prisma.products.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return products.map(p => p.category);
  }

  async findTags(): Promise<string[]> {
    const products = await this.prisma.products.findMany({
      select: { tags: true },
    });
    const allTags = products.flatMap(p => p.tags);
    return [...new Set(allTags)].sort();
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
