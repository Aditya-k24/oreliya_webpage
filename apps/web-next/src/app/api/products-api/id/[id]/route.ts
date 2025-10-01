import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { ProductController } from '@/api-lib/controllers/productController';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import { adminMiddleware } from '@/api-lib/middlewares/adminMiddleware';
import { prisma } from '@/api-lib/prisma';

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export const GET = createNextRouteHandler(productController.getProductById);
export const PUT = createNextRouteHandler(
  authenticateToken,
  adminMiddleware,
  productController.updateProduct
);
export const DELETE = createNextRouteHandler(
  authenticateToken,
  adminMiddleware,
  productController.deleteProduct
);


