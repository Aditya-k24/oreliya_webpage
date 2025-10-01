import { Router } from 'express';
import { WebhookController } from '../controllers/webhookController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { prisma } from '../lib/prisma';

const router: Router = Router();

// Initialize repositories and services
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, null);
const webhookController = new WebhookController(orderService);

// Routes
router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
