import { Router } from 'express';
import Stripe from 'stripe';
import { WebhookController } from '../controllers/webhookController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { prisma } from '../lib/prisma';

const router = Router();
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const orderService = new OrderService(orderRepository, cartRepository, stripe);
const webhookController = new WebhookController(orderService);

router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
