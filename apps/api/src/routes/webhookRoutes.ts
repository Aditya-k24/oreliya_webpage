import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { WebhookController } from '../controllers/webhookController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { prisma } from '../lib/prisma';

const router: ExpressRouter = Router();

// Initialize dependencies
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository);
const webhookController = new WebhookController(orderService);

// Webhook routes (no authentication required for Stripe webhooks)
router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
