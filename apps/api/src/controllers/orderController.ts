import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';
import { CreateOrderRequest } from '../types/order';
import { AuthenticatedRequest } from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  // POST /api/orders - Create new order
  createOrder = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const data: CreateOrderRequest = req.body;

      if (!data.billingAddressId || !data.shippingAddressId) {
        return res.status(400).json({
          success: false,
          message: 'Billing and shipping address IDs are required',
        });
      }

      const result = await this.orderService.createOrder(userId, data);
      return res.status(201).json(result);
    }
  );

  // GET /api/orders/:id - Get order by ID
  getOrderById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { id } = req.params;

      const result = await this.orderService.getOrderById(id, userId);
      return res.status(200).json(result);
    }
  );

  // GET /api/orders - Get user's orders
  getOrders = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;

      const result = await this.orderService.getOrdersByUserId(userId);
      return res.status(200).json(result);
    }
  );
}
