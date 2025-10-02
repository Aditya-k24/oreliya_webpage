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
    // Generate slug from name
    const slug = ProductRepository.generateSlug(data.name);

    return this.prisma.product.create({
      data: {
        ...data,
        slug,
        category: data.category as any,
        metadata: data.metadata as any,
        // Create customizations if provided
        customizations: data.customizations
          ? {
              create: data.customizations.map(
                customization =>
                  ({
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
                  }) as any
              ),
            }
          : undefined,
        // Don't include variants in create - they should be created separately
        variants: undefined,
      },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async getProductBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async getProducts(
    filters: ProductFilters = {},
    sort: ProductSortOptions = { field: 'createdAt', order: 'desc' },
    limit = 20,
    offset = 0
  ) {

    const where: Prisma.ProductWhereInput = {
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
      this.prisma.product.findMany({
        where,
        include: {
          variants: true,
          customizations: true,
        },
        orderBy: { [sort.field]: sort.order },
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
        category: data.category as any,
        metadata: data.metadata as any,
        // Update customizations if provided
        customizations: data.customizations
          ? {
              deleteMany: {}, // Delete all existing customizations
              create: data.customizations.map(
                customization =>
                  ({
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
                  }) as any
              ),
            }
          : undefined,
        // Don't include variants in update - they should be updated separately
        variants: undefined,
      },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getFeaturedProducts() {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        variants: true,
        customizations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOnSaleProducts() {
    return this.prisma.product.findMany({
      where: { isOnSale: true, isActive: true },
      include: {
        variants: true,
        customizations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelatedProducts(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { category: true },
    });

    if (!product) return [];

    return this.prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: productId },
        isActive: true,
      },
      include: {
        variants: true,
        customizations: true,
      },
      take: 4,
    });
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        variants: true,
        customizations: true,
      },
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

  async findCategories(): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return products.map(p => p.category);
  }

  async findTags(): Promise<string[]> {
    const products = await this.prisma.product.findMany({
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
