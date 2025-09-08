import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { asyncWrapper } from '../middlewares/asyncWrapper';

export class WebhookController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  handleStripeWebhook = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const signature = req.headers['stripe-signature'] as string;
      const payload = JSON.stringify(req.body);

      if (!signature) {
        res.status(400).json({ success: false, message: 'Missing signature' });
        return;
      }

      try {
        await this.orderService.handleStripeWebhook(payload, signature);
        res.json({ success: true, message: 'Webhook processed' });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Webhook error:', error);
        res
          .status(400)
          .json({ success: false, message: 'Webhook processing failed' });
      }
    }
  );
}
