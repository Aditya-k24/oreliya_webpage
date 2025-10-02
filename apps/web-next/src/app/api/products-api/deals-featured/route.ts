import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { ProductController } from '@/api-lib/controllers/productController';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

export const GET = createNextRouteHandler(productController.getDealsAndFeatured);


