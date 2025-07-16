import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { OrderService } from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';

export class WebhookController {
  private orderService: OrderService;

  private stripe: Stripe;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-06-30.basil',
    });
  }

  // POST /api/webhooks/stripe - Handle Stripe webhooks
  handleStripeWebhook = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      let event: Stripe.Event;

      try {
        event = this.stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err}`);
      }

      try {
        await this.orderService.handleStripeWebhook(event);
        return res.json({ received: true });
      } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
      }
    }
  );
}
