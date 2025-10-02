import { NextRequest } from 'next/server';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AddressController } from '@/api-lib/controllers/addressController';
import { AddressService } from '@/api-lib/services/addressService';
import { AddressRepository } from '@/api-lib/repositories/addressRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
// Lazy import Prisma at runtime to avoid build-time initialization
async function getAddressController(): Promise<AddressController> {
  const { default: prisma } = await import('@/api-lib/config/database');
  const repo = new AddressRepository(prisma);
  const service = new AddressService(repo);
  return new AddressController(service);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const controller = await getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.getAddressById.bind(controller)
  )(request, { params });
};

export const PUT = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const controller = await getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.updateAddress.bind(controller)
  )(request, { params });
};

export const DELETE = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const controller = await getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.deleteAddress.bind(controller)
  )(request, { params });
};


