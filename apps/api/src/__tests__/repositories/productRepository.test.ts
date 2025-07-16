import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../repositories/productRepository';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductSortOptions,
} from '../../types/product';

// Mock PrismaClient
const mockPrisma = {
  product: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  productVariant: {
    deleteMany: jest.fn(),
  },
  productCustomization: {
    deleteMany: jest.fn(),
  },
} as unknown as PrismaClient;

describe('ProductRepository', () => {
  let productRepository: ProductRepository;

  beforeEach(() => {
    productRepository = new ProductRepository(mockPrisma);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product with variants and customizations', async () => {
      const createData: CreateProductRequest = {
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        category: 'Test Category',
        tags: ['test', 'product'],
        images: ['image1.jpg'],
        variants: [
          {
            size: 'M',
            material: 'Cotton',
            price: 99.99,
            stockQuantity: 10,
            sku: 'TEST-001-M',
            isActive: true,
          },
        ],
        customizations: [
          {
            name: 'Engraving',
            type: 'text',
            required: false,
            options: [],
            priceAdjustment: 10.0,
          },
        ],
      };

      const expectedProduct = {
        id: 'test-id',
        ...createData,
        slug: 'test-product',
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [{ id: 'variant-1', ...createData.variants[0] }],
        customizations: [{ id: 'custom-1', ...createData.customizations[0] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.product.create as jest.Mock).mockResolvedValue(
        expectedProduct
      );

      const result = await productRepository.create(createData);

      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: createData.name,
          slug: 'test-product',
          description: createData.description,
          shortDescription: createData.shortDescription,
          price: createData.price,
          compareAtPrice: createData.compareAtPrice,
          images: createData.images,
          category: createData.category,
          tags: createData.tags,
          isActive: true,
          isFeatured: false,
          isOnSale: false,
          salePercentage: createData.salePercentage,
          metadata: createData.metadata,
          variants: {
            create: createData.variants.map(variant => ({
              size: variant.size,
              material: variant.material,
              price: variant.price,
              stockQuantity: variant.stockQuantity,
              sku: variant.sku,
              isActive: variant.isActive,
            })),
          },
          customizations: {
            create: createData.customizations.map(customization => ({
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

      expect(result).toEqual(expectedProduct);
    });

    it('should generate correct slug from product name', async () => {
      const createData: CreateProductRequest = {
        name: 'Special Product Name!',
        description: 'Test description',
        price: 99.99,
        category: 'Test Category',
        tags: ['test'],
        images: ['image1.jpg'],
        variants: [],
        customizations: [],
      };

      const expectedProduct = {
        id: 'test-id',
        ...createData,
        slug: 'special-product-name',
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [],
        customizations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.product.create as jest.Mock).mockResolvedValue(
        expectedProduct
      );

      await productRepository.create(createData);

      expect(mockPrisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'special-product-name',
          }),
        })
      );
    });
  });

  describe('findById', () => {
    it('should find product by ID with variants and customizations', async () => {
      const productId = 'test-id';
      const expectedProduct = {
        id: productId,
        name: 'Test Product',
        slug: 'test-product',
        variants: [],
        customizations: [],
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(
        expectedProduct
      );

      const result = await productRepository.findById(productId);

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: {
          variants: true,
          customizations: true,
        },
      });

      expect(result).toEqual(expectedProduct);
    });
  });

  describe('findBySlug', () => {
    it('should find product by slug with variants and customizations', async () => {
      const slug = 'test-product';
      const expectedProduct = {
        id: 'test-id',
        name: 'Test Product',
        slug,
        variants: [],
        customizations: [],
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(
        expectedProduct
      );

      const result = await productRepository.findBySlug(slug);

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { slug },
        include: {
          variants: true,
          customizations: true,
        },
      });

      expect(result).toEqual(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should find products with filters, sorting, and pagination', async () => {
      const filters: ProductFilters = {
        category: 'Test Category',
        priceMin: 10,
        priceMax: 100,
        isActive: true,
      };

      const sort: ProductSortOptions = {
        field: 'price',
        order: 'asc',
      };

      const page = 2;
      const limit = 10;

      const expectedProducts = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];

      const expectedTotal = 25;

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        expectedProducts
      );
      (mockPrisma.product.count as jest.Mock).mockResolvedValue(expectedTotal);

      const result = await productRepository.findAll(
        filters,
        sort,
        page,
        limit
      );

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          category: 'Test Category',
          price: {
            gte: 10,
            lte: 100,
          },
          isActive: true,
        }),
        orderBy: { price: 'asc' },
        skip: 10,
        take: 10,
        include: {
          variants: true,
          customizations: true,
        },
      });

      expect(mockPrisma.product.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          category: 'Test Category',
          price: {
            gte: 10,
            lte: 100,
          },
          isActive: true,
        }),
      });

      expect(result).toEqual({
        products: expectedProducts,
        total: expectedTotal,
      });
    });

    it('should handle search filter correctly', async () => {
      const filters: ProductFilters = {
        search: 'diamond',
      };

      const sort: ProductSortOptions = {
        field: 'name',
        order: 'asc',
      };

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValue(0);

      await productRepository.findAll(filters, sort);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: [
            { name: { contains: 'diamond', mode: 'insensitive' } },
            { description: { contains: 'diamond', mode: 'insensitive' } },
            { tags: { hasSome: ['diamond'] } },
          ],
        }),
        orderBy: { name: 'asc' },
        skip: 0,
        take: 20,
        include: {
          variants: true,
          customizations: true,
        },
      });
    });

    it('should handle inStock filter correctly', async () => {
      const filters: ProductFilters = {
        inStock: true,
      };

      const sort: ProductSortOptions = {
        field: 'name',
        order: 'asc',
      };

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.product.count as jest.Mock).mockResolvedValue(0);

      await productRepository.findAll(filters, sort);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          variants: {
            some: {
              stockQuantity: { gt: 0 },
              isActive: true,
            },
          },
        }),
        orderBy: { name: 'asc' },
        skip: 0,
        take: 20,
        include: {
          variants: true,
          customizations: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update product with new data', async () => {
      const productId = 'test-id';
      const updateData: UpdateProductRequest = {
        name: 'Updated Product',
        price: 149.99,
        variants: [
          {
            size: 'L',
            material: 'Silk',
            price: 149.99,
            stockQuantity: 5,
            sku: 'UPDATED-SKU-1',
            isActive: true,
          },
        ],
        customizations: [
          {
            name: 'Custom Engraving',
            type: 'text' as const,
            required: true,
            options: [],
            priceAdjustment: 10.0,
          },
        ],
      };

      const expectedProduct = {
        id: productId,
        ...updateData,
        slug: 'updated-product',
        variants: [{ id: 'variant-1', ...updateData.variants![0] }],
        customizations: [{ id: 'custom-1', ...updateData.customizations![0] }],
      };

      (mockPrisma.product.update as jest.Mock).mockResolvedValue(
        expectedProduct
      );

      const result = await productRepository.update(productId, updateData);

      expect(mockPrisma.productVariant.deleteMany).toHaveBeenCalledWith({
        where: { productId },
      });

      expect(mockPrisma.productCustomization.deleteMany).toHaveBeenCalledWith({
        where: { productId },
      });

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: expect.objectContaining({
          name: 'Updated Product',
          slug: 'updated-product',
          price: 149.99,
          variants: {
            create: updateData.variants!.map(variant => ({
              size: variant.size,
              material: variant.material,
              price: variant.price,
              stockQuantity: variant.stockQuantity,
              sku: variant.sku,
              isActive: variant.isActive,
            })),
          },
          customizations: {
            create: updateData.customizations!.map(customization => ({
              name: customization.name,
              type: customization.type,
              required: customization.required,
              options: customization.options,
              priceAdjustment: customization.priceAdjustment,
            })),
          },
        }),
        include: {
          variants: true,
          customizations: true,
        },
      });

      expect(result).toEqual(expectedProduct);
    });

    it('should update product without variants and customizations', async () => {
      const productId = 'test-id';
      const updateData: UpdateProductRequest = {
        name: 'Simple Update',
        price: 199.99,
      };

      const expectedProduct = {
        id: productId,
        ...updateData,
        slug: 'updated-product',
      };

      (mockPrisma.product.update as jest.Mock).mockResolvedValue(
        expectedProduct
      );

      const result = await productRepository.update(productId, updateData);

      expect(mockPrisma.productVariant.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.productCustomization.deleteMany).not.toHaveBeenCalled();

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: expect.objectContaining({
          name: 'Simple Update',
          slug: 'simple-update',
          price: 199.99,
        }),
        include: {
          variants: true,
          customizations: true,
        },
      });

      expect(result).toEqual(expectedProduct);
    });
  });

  describe('delete', () => {
    it('should delete product by ID', async () => {
      const productId = 'test-id';

      (mockPrisma.product.delete as jest.Mock).mockResolvedValue({});

      await productRepository.delete(productId);

      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe('findFeatured', () => {
    it('should find featured products', async () => {
      const expectedProducts = [
        { id: '1', name: 'Featured Product 1', isFeatured: true },
        { id: '2', name: 'Featured Product 2', isFeatured: true },
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        expectedProducts
      );

      const result = await productRepository.findFeatured();

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { isFeatured: true, isActive: true },
        include: {
          variants: true,
          customizations: true,
        },
        take: 10,
      });

      expect(result).toEqual(expectedProducts);
    });
  });

  describe('findDeals', () => {
    it('should find products on sale', async () => {
      const expectedProducts = [
        { id: '1', name: 'Deal Product 1', isOnSale: true },
        { id: '2', name: 'Deal Product 2', isOnSale: true },
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        expectedProducts
      );

      const result = await productRepository.findDeals();

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { isOnSale: true, isActive: true },
        include: {
          variants: true,
          customizations: true,
        },
        take: 10,
      });

      expect(result).toEqual(expectedProducts);
    });
  });

  describe('findCategories', () => {
    it('should find all unique categories', async () => {
      const categoriesData = [
        { category: 'Jewelry' },
        { category: 'Electronics' },
      ];

      const expectedCategories = ['Jewelry', 'Electronics'];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        categoriesData
      );

      const result = await productRepository.findCategories();

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        select: { category: true },
        where: { isActive: true },
        distinct: ['category'],
      });

      expect(result).toEqual(expectedCategories);
    });
  });

  describe('findTags', () => {
    it('should find all unique tags', async () => {
      const productsData = [
        { tags: ['diamond', 'ring', 'jewelry'] },
        { tags: ['watch', 'luxury', 'jewelry'] },
        { tags: ['diamond', 'premium'] },
      ];

      const expectedTags = [
        'diamond',
        'ring',
        'jewelry',
        'watch',
        'luxury',
        'premium',
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        productsData
      );

      const result = await productRepository.findTags();

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        select: { tags: true },
        where: { isActive: true },
      });

      expect(result).toEqual(expectedTags);
    });
  });

  describe('private methods', () => {
    describe('generateSlug', () => {
      it('should generate correct slugs', () => {
        const testCases = [
          { input: 'Simple Product', expected: 'simple-product' },
          { input: 'Product with Spaces!', expected: 'product-with-spaces' },
          { input: 'Product@#$%^&*()', expected: 'product' },
          { input: 'Product-Name', expected: 'product-name' },
          { input: 'Product_Name', expected: 'product-name' },
          { input: 'Product123', expected: 'product123' },
          { input: '  Product  ', expected: 'product' },
        ];

        testCases.forEach(({ input, expected }) => {
          const result = (ProductRepository as any).generateSlug(input);
          expect(result).toBe(expected);
        });
      });
    });

    describe('buildWhereClause', () => {
      it('should build correct where clause for all filters', () => {
        const filters: ProductFilters = {
          category: 'Jewelry',
          tags: ['diamond', 'ring'],
          priceMin: 100,
          priceMax: 1000,
          isActive: true,
          isFeatured: true,
          isOnSale: false,
          inStock: true,
          search: 'diamond',
        };

        const result = (ProductRepository as any).buildWhereClause(filters);

        expect(result).toEqual({
          category: 'Jewelry',
          tags: { hasSome: ['diamond', 'ring'] },
          price: {
            gte: 100,
            lte: 1000,
          },
          isActive: true,
          isFeatured: true,
          isOnSale: false,
          variants: {
            some: {
              stockQuantity: { gt: 0 },
              isActive: true,
            },
          },
          OR: [
            { name: { contains: 'diamond', mode: 'insensitive' } },
            { description: { contains: 'diamond', mode: 'insensitive' } },
            { tags: { hasSome: ['diamond'] } },
          ],
        });
      });

      it('should handle empty filters', () => {
        const filters: ProductFilters = {};
        const result = (ProductRepository as any).buildWhereClause(filters);
        expect(result).toEqual({});
      });
    });

    describe('buildOrderByClause', () => {
      it('should build correct order by clause', () => {
        const sort: ProductSortOptions = {
          field: 'price',
          order: 'desc',
        };

        const result = (ProductRepository as any).buildOrderByClause(sort);

        expect(result).toEqual({ price: 'desc' });
      });
    });
  });
});
