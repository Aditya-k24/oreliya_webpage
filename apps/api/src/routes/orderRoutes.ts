import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { prisma } from '../lib/prisma';

const router: Router = Router();

// Initialize repositories and services
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, null);
const orderController = new OrderController(orderService);

// Routes
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getOrdersByUserId);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
