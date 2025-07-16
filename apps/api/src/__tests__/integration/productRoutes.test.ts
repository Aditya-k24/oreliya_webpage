import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '../../repositories/productRepository';
import { ProductService } from '../../services/productService';
import {
  CreateProductRequest,
  UpdateProductRequest,
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

describe('Product Routes Integration', () => {
  let productRepository: ProductRepository;
  let productService: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Initialize dependencies
    productRepository = new ProductRepository(mockPrisma);
    productService = new ProductService(productRepository);
  });

  describe('GET /api/products', () => {
    it('should return products with pagination', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product 1',
          slug: 'test-product-1',
          description: 'Test description',
          price: 99.99,
          category: 'Test Category',
          tags: ['test'],
          images: ['image1.jpg'],
          isActive: true,
          isFeatured: false,
          isOnSale: false,
          variants: [],
          customizations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts
      );
      (mockPrisma.product.count as jest.Mock).mockResolvedValue(1);

      // This would normally be tested with a real Express app
      // For now, we'll test the service layer directly
      const result = await productService.getProducts({
        page: 1,
        limit: 20,
      });

      expect(result.success).toBe(true);
      expect(result.data.products).toHaveLength(1);
      expect(result.data.pagination.page).toBe(1);
      expect(result.data.pagination.total).toBe(1);
    });

    it('should handle filters correctly', async () => {
      const mockProducts: any[] = [];
      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts
      );
      (mockPrisma.product.count as jest.Mock).mockResolvedValue(0);

      const result = await productService.getProducts({
        category: 'Jewelry',
        priceMin: 100,
        priceMax: 1000,
        isOnSale: true,
      });

      expect(result.success).toBe(true);
      expect(result.data.filters.category).toBe('Jewelry');
      expect(result.data.filters.priceMin).toBe(100);
      expect(result.data.filters.priceMax).toBe(1000);
      expect(result.data.filters.isOnSale).toBe(true);
    });
  });

  describe('GET /api/products/:slug', () => {
    it('should return product by slug', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        price: 99.99,
        category: 'Test Category',
        tags: ['test'],
        images: ['image1.jpg'],
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [],
        customizations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const result = await productService.getProductBySlug('test-product');

      expect(result.success).toBe(true);
      expect(result.data.product.slug).toBe('test-product');
    });

    it('should return 404 for non-existent product', async () => {
      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        productService.getProductBySlug('non-existent')
      ).rejects.toThrow('Product not found');
    });
  });

  describe('GET /api/products/id/:id', () => {
    it('should return product by ID', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test description',
        price: 99.99,
        category: 'Test Category',
        tags: ['test'],
        images: ['image1.jpg'],
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [],
        customizations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(
        mockProduct
      );

      const result = await productService.getProductById('1');

      expect(result.success).toBe(true);
      expect(result.data.product.id).toBe('1');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const createData: CreateProductRequest = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'Test Category',
        tags: ['test'],
        images: ['image1.jpg'],
        variants: [
          {
            size: 'M',
            material: 'Cotton',
            price: 99.99,
            stockQuantity: 10,
            sku: 'TEST-SKU-1',
            isActive: true,
          },
        ],
        customizations: [
          {
            name: 'Engraving',
            type: 'text' as const,
            required: true,
            options: [],
            priceAdjustment: 5.0,
          },
        ],
      };

      const mockCreatedProduct = {
        id: 'new-id',
        ...createData,
        slug: 'new-product',
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [{ id: 'variant-1', ...createData.variants[0] }],
        customizations: [{ id: 'custom-1', ...createData.customizations[0] }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.product.create as jest.Mock).mockResolvedValue(
        mockCreatedProduct
      );

      const result = await productService.createProduct(createData);

      expect(result.success).toBe(true);
      expect(result.data.product.name).toBe('Test Product');
      expect(result.data.product.slug).toBe('new-product');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '',
        description: '',
        price: 0,
        category: '',
        tags: [],
        images: [],
        variants: [],
        customizations: [],
      };

      await expect(productService.createProduct(invalidData)).rejects.toThrow(
        'Missing required fields'
      );
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const existingProduct = {
        id: '1',
        name: 'Existing Product',
        slug: 'existing-product',
        description: 'Existing description',
        price: 99.99,
        category: 'Existing Category',
        tags: ['existing'],
        images: ['existing-image.jpg'],
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [],
        customizations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData: UpdateProductRequest = {
        name: 'Updated Product',
        price: 149.99,
      };

      const mockUpdatedProduct = {
        ...existingProduct,
        ...updateData,
        slug: 'updated-product',
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(
        existingProduct
      );
      (mockPrisma.product.update as jest.Mock).mockResolvedValue(
        mockUpdatedProduct
      );

      const result = await productService.updateProduct('1', updateData);

      expect(result.success).toBe(true);
      expect(result.data.product.name).toBe('Updated Product');
      expect(result.data.product.slug).toBe('updated-product');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product', async () => {
      const existingProduct = {
        id: '1',
        name: 'Product to Delete',
        slug: 'product-to-delete',
        description: 'Description',
        price: 99.99,
        category: 'Category',
        tags: ['delete'],
        images: ['image.jpg'],
        isActive: true,
        isFeatured: false,
        isOnSale: false,
        variants: [],
        customizations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.product.findUnique as jest.Mock).mockResolvedValue(
        existingProduct
      );
      (mockPrisma.product.delete as jest.Mock).mockResolvedValue({});

      const result = await productService.deleteProduct('1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Product deleted successfully');
    });
  });

  describe('GET /api/products/deals/featured', () => {
    it('should return deals and featured products', async () => {
      const mockDeals = [
        {
          id: '1',
          name: 'Deal Product',
          isOnSale: true,
        },
      ];

      const mockFeatured = [
        {
          id: '2',
          name: 'Featured Product',
          isFeatured: true,
        },
      ];

      (mockPrisma.product.findMany as jest.Mock)
        .mockResolvedValueOnce(mockDeals)
        .mockResolvedValueOnce(mockFeatured);

      const result = await productService.getDealsAndFeatured();

      expect(result.success).toBe(true);
      expect(result.data.deals).toHaveLength(1);
      expect(result.data.featured).toHaveLength(1);
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { category: 'Jewelry' },
        { category: 'Electronics' },
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const result = await productService.getCategories();

      expect(result.success).toBe(true);
      expect(result.data.categories).toEqual(['Jewelry', 'Electronics']);
    });
  });

  describe('GET /api/products/tags', () => {
    it('should return all tags', async () => {
      const mockProducts = [
        { tags: ['diamond', 'ring'] },
        { tags: ['watch', 'luxury'] },
      ];

      (mockPrisma.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts
      );

      const result = await productService.getTags();

      expect(result.success).toBe(true);
      expect(result.data.tags).toEqual(['diamond', 'ring', 'watch', 'luxury']);
    });
  });
});
