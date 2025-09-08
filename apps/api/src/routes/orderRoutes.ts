import { Router } from 'express';
import Stripe from 'stripe';
import { OrderController } from '../controllers/orderController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router = Router();
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const orderService = new OrderService(orderRepository, cartRepository, stripe);
const orderController = new OrderController(orderService);

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.get('/', orderController.getUserOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
