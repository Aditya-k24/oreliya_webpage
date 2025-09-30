import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { ProductController } from '../controllers/productController';
import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { authenticateToken } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { prisma } from '../lib/prisma';

const router: ExpressRouter = Router();

// Initialize dependencies
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Public routes
router.get('/', productController.getProducts);
router.get('/deals/featured', productController.getDealsAndFeatured);
router.get('/categories', productController.getCategories);
router.get('/tags', productController.getTags);
router.get('/id/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);

// Admin-only routes (require authentication + admin role)
router.post(
  '/',
  authenticateToken,
  adminMiddleware,
  productController.createProduct
);
router.put(
  '/:id',
  authenticateToken,
  adminMiddleware,
  productController.updateProduct
);
router.delete(
  '/:id',
  authenticateToken,
  adminMiddleware,
  productController.deleteProduct
);

// Admin delete by slug (to support frontend calling with slugs)
router.delete(
  '/slug/:slug',
  authenticateToken,
  adminMiddleware,
  productController.deleteProductBySlug
);

export default router;
