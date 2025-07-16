import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
} from '../types/product';
import { asyncHandler } from '../utils/asyncHandler';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  // GET /api/products - Get all products with pagination, search, filters, sorting
  getProducts = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const queryParams: ProductQueryParams = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        search: req.query.search as string,
        category: req.query.category as string,
        tags: req.query.tags as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
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

      const result = await this.productService.getProducts(queryParams);
      return res.status(200).json(result);
    }
  );

  // GET /api/products/:slug - Get product by slug
  getProductBySlug = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { slug } = req.params;
      const result = await this.productService.getProductBySlug(slug);
      return res.status(200).json(result);
    }
  );

  // GET /api/products/id/:id - Get product by ID
  getProductById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const result = await this.productService.getProductById(id);
      return res.status(200).json(result);
    }
  );

  // POST /api/products - Create new product (admin only)
  createProduct = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const productData: CreateProductRequest = req.body;

      // Basic validation
      if (
        !productData.name ||
        !productData.description ||
        !productData.price ||
        !productData.category
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Missing required fields: name, description, price, category',
        });
      }

      const result = await this.productService.createProduct(productData);
      return res.status(201).json(result);
    }
  );

  // PUT /api/products/:id - Update product (admin only)
  updateProduct = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const updateData: UpdateProductRequest = { ...req.body, id };

      const result = await this.productService.updateProduct(id, updateData);
      return res.status(200).json(result);
    }
  );

  // DELETE /api/products/:id - Delete product (admin only)
  deleteProduct = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const result = await this.productService.deleteProduct(id);
      return res.status(200).json(result);
    }
  );

  // GET /api/products/deals/featured - Get deals and featured products
  getDealsAndFeatured = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const result = await this.productService.getDealsAndFeatured();
      return res.status(200).json(result);
    }
  );

  // GET /api/products/categories - Get all categories
  getCategories = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const result = await this.productService.getCategories();
      return res.status(200).json(result);
    }
  );

  // GET /api/products/tags - Get all tags
  getTags = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const result = await this.productService.getTags();
      return res.status(200).json(result);
    }
  );
}
