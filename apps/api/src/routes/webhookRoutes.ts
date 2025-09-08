import { Router } from 'express';
import Stripe from 'stripe';
import { WebhookController } from '../controllers/webhookController';
import { OrderRepository } from '../repositories/orderRepository';
import { CartRepository } from '../repositories/cartRepository';

const router = Router();
const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const orderService = new OrderService(orderRepository, cartRepository, stripe);
const webhookController = new WebhookController(orderService);

router.post('/stripe', webhookController.handleStripeWebhook);

export default router;
