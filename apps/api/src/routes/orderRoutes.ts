import { Router } from 'express';
import Stripe from 'stripe';
import { OrderController } from '../controllers/orderController';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
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
