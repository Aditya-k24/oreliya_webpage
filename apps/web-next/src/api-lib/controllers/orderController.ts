import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { OrderService } from '../services/orderService';
import { CreateOrderRequest } from '../types/order';
import { asyncWrapper } from '../middlewares/asyncWrapper';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  createOrder = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const orderData: CreateOrderRequest = req.body;
      const result = await this.orderService.createOrder(userId, orderData);

      res.status(201).json(result);
    }
  );

  getOrderById = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await this.orderService.getOrderById(id, userId);
      res.json(result);
    }
  );

  getOrdersByUserId = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const userId = req.user.id;

      const result = await this.orderService.getOrdersByUserId(userId);
      res.json(result);
    }
  );

  updateOrderStatus = asyncWrapper(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;

      const result = await this.orderService.updateOrderStatus(id, status);
      res.json(result);
    }
  );
}
