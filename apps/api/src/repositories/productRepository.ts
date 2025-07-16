import { PrismaClient } from '@prisma/client';
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

  async create(data: CreateProductRequest) {
    const slug = ProductRepository.generateSlug(data.name);
    return this.prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        images: data.images,
        category: data.category,
        tags: data.tags,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isOnSale: data.isOnSale ?? false,
        salePercentage: data.salePercentage,
        metadata: data.metadata as any,
        variants: {
          create: data.variants.map(variant => ({
            size: variant.size,
            material: variant.material,
            price: variant.price,
            stockQuantity: variant.stockQuantity,
            sku: variant.sku,
            isActive: variant.isActive,
          })),
        },
        customizations: {
          create: data.customizations.map(customization => ({
            name: customization.name,
            type: customization.type,
            required: customization.required,
            options: customization.options,
            priceAdjustment: customization.priceAdjustment,
          })),
        },
      },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async findAll(
    filters: ProductFilters,
    sort: ProductSortOptions,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    const where = ProductRepository.buildWhereClause(filters);
    const orderBy = ProductRepository.buildOrderByClause(sort);
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          variants: true,
          customizations: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { products, total };
  }

  async update(id: string, data: UpdateProductRequest) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.name) {
      updateData.slug = ProductRepository.generateSlug(data.name);
    }
    if (data.variants) {
      await this.prisma.productVariant.deleteMany({
        where: { productId: id },
      });
      updateData.variants = {
        create: data.variants.map(variant => ({
          size: variant.size,
          material: variant.material,
          price: variant.price,
          stockQuantity: variant.stockQuantity,
          sku: variant.sku,
          isActive: variant.isActive,
        })),
      };
    }
    if (data.customizations) {
      await this.prisma.productCustomization.deleteMany({
        where: { productId: id },
      });
      updateData.customizations = {
        create: data.customizations.map(customization => ({
          name: customization.name,
          type: customization.type,
          required: customization.required,
          options: customization.options,
          priceAdjustment: customization.priceAdjustment,
        })),
      };
    }
    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
        customizations: true,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        variants: true,
        customizations: true,
      },
      take: 10,
    });
  }

  async findDeals() {
    return this.prisma.product.findMany({
      where: { isOnSale: true, isActive: true },
      include: {
        variants: true,
        customizations: true,
      },
      take: 10,
    });
  }

  async findCategories() {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      where: { isActive: true },
      distinct: ['category'],
    });
    return categories.map((c: { category: string }) => c.category);
  }

  async findTags() {
    const products = await this.prisma.product.findMany({
      select: { tags: true },
      where: { isActive: true },
    });
    const allTags = products.flatMap((p: { tags: string[] }) => p.tags);
    return [...new Set(allTags)];
  }

  private static generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private static buildWhereClause(filters: ProductFilters) {
    const where: Record<string, unknown> = {};
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      where.price = {};
      if (filters.priceMin !== undefined) {
        (where.price as Record<string, unknown>).gte = filters.priceMin;
      }
      if (filters.priceMax !== undefined) {
        (where.price as Record<string, unknown>).lte = filters.priceMax;
      }
    }
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }
    if (filters.isOnSale !== undefined) {
      where.isOnSale = filters.isOnSale;
    }
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        where.variants = {
          some: {
            stockQuantity: { gt: 0 },
            isActive: true,
          },
        };
      }
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ];
    }
    return where;
  }

  private static buildOrderByClause(sort: ProductSortOptions) {
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sort.field] = sort.order;
    return orderBy;
  }
}
