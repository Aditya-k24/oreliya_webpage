import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { OrderController } from '../controllers/orderController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { authenticateToken } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router: ExpressRouter = Router();

// Initialize dependencies
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository);
const orderController = new OrderController(orderService);

// All order routes require authentication
router.use(authenticateToken);

// Order routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

export default router;
