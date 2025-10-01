import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { WebhookController } from '@/api-lib/controllers/webhookController';
import { OrderService } from '@/api-lib/services/orderService';
import { OrderRepository } from '@/api-lib/repositories/orderRepository';
import { CartRepository } from '@/api-lib/repositories/cartRepository';
import { prisma } from '@/api-lib/prisma';

const orderRepository = new OrderRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, null);
const webhookController = new WebhookController(orderService);

export const POST = createNextRouteHandler(webhookController.handleStripeWebhook);


