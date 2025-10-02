import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { OrderController } from '@/api-lib/controllers/orderController';
import { OrderService } from '@/api-lib/services/orderService';
import { OrderRepository } from '@/api-lib/repositories/orderRepository';
import { CartRepository } from '@/api-lib/repositories/cartRepository';
import prisma from '@/api-lib/config/database';

const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, null);
const orderController = new OrderController(orderService);

export const PATCH = createNextRouteHandler(orderController.updateOrderStatus);


