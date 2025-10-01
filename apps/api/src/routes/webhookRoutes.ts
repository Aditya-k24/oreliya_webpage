import { Router } from 'express';
import Stripe from 'stripe';
import { WebhookController } from '../controllers/webhookController';
import { OrderService } from '../services/orderService';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';
import { prisma } from '../lib/prisma';

const router: Router = Router();

// Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

// Initialize repositories and services
const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, stripe);
const webhookController = new WebhookController(orderService);

// Routes
router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
