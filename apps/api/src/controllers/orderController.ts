import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { CreateOrderRequest } from '../types/order';
import { asyncWrapper } from '../middlewares/asyncWrapper';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  createOrder = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const data: CreateOrderRequest = req.body;
      const result = await this.orderService.createOrder(userId, data);

      res.status(201).json(result);
    }
  );

  getOrder = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const result = await this.orderService.getOrder(userId, id);

      res.json(result);
    }
  );

  getUserOrders = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await this.orderService.getUserOrders(userId);

      res.json(result);
    }
  );

  updateOrderStatus = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;

      const result = await this.orderService.updateOrderStatus(id, status);

      res.json(result);
    }
  );
}
