import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  ProductFilters,
  ProductSortOptions,
} from '../types/product';
import { asyncWrapper } from '../middlewares/asyncWrapper';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  getProducts = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const queryParams: ProductQueryParams = {
        page: req.query.page
          ? parseInt(req.query.page as string, 10)
          : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : undefined,
        search: req.query.search as string,
        category: req.query.category as string,
        tags: req.query.tags as string,
        priceMin: req.query.priceMin
          ? parseFloat(req.query.priceMin as string)
          : undefined,
        priceMax: req.query.priceMax
          ? parseFloat(req.query.priceMax as string)
          : undefined,
        isActive: req.query.isActive
          ? req.query.isActive === 'true'
          : undefined,
        isFeatured: req.query.isFeatured
          ? req.query.isFeatured === 'true'
          : undefined,
        isOnSale: req.query.isOnSale
          ? req.query.isOnSale === 'true'
          : undefined,
        inStock: req.query.inStock ? req.query.inStock === 'true' : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      // Convert ProductQueryParams to ProductFilters
      const filters: ProductFilters = {
        category: queryParams.category,
        tags: queryParams.tags
          ? queryParams.tags.split(',').map(tag => tag.trim())
          : undefined,
        priceMin: queryParams.priceMin,
        priceMax: queryParams.priceMax,
        isActive: queryParams.isActive,
        isFeatured: queryParams.isFeatured,
        isOnSale: queryParams.isOnSale,
        inStock: queryParams.inStock,
        search: queryParams.search,
      };

      // Convert to ProductSortOptions
      const sort: ProductSortOptions = {
        field:
          (queryParams.sortBy as
            | 'name'
            | 'price'
            | 'createdAt'
            | 'updatedAt') || 'createdAt',
        order: queryParams.sortOrder || 'desc',
      };

      const result = await this.productService.getProducts(filters, sort);
      res.json(result);
    }
  );

  getProductById = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const result = await this.productService.getProductById(id);
      res.json(result);
    }
  );

  getProductBySlug = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { slug } = req.params;
      const result = await this.productService.getProductBySlug(slug);
      res.json(result);
    }
  );

  createProduct = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const productData: CreateProductRequest = req.body;
      const result = await this.productService.createProduct(productData);
      res.status(201).json(result);
    }
  );

  updateProduct = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const productData: UpdateProductRequest = req.body;
      const result = await this.productService.updateProduct(id, productData);
      res.json(result);
    }
  );

  deleteProduct = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const result = await this.productService.deleteProduct(id);
      res.json(result);
    }
  );

  getFeaturedProducts = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.productService.getFeaturedProducts();
      res.json(result);
    }
  );

  getOnSaleProducts = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.productService.getOnSaleProducts();
      res.json(result);
    }
  );

  getDealsAndFeatured = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.productService.getDealsAndFeatured();
      res.json(result);
    }
  );

  getRelatedProducts = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const result = await this.productService.getRelatedProducts(id);
      res.json(result);
    }
  );

  searchProducts = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        res
          .status(400)
          .json({ success: false, message: 'Search query is required' });
        return;
      }
      const result = await this.productService.searchProducts(q);
      res.json(result);
    }
  );

  getProductStats = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.productService.getProductStats();
      res.json(result);
    }
  );

  getCategories = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.productService.getCategories();
      res.json(result);
    }
  );

  getTags = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const result = await this.productService.getTags();
    res.json(result);
  });
}
