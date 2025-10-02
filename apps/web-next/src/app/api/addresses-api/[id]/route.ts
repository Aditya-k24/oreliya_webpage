import { NextRequest } from 'next/server';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AddressController } from '@/api-lib/controllers/addressController';
import { AddressService } from '@/api-lib/services/addressService';
import { AddressRepository } from '@/api-lib/repositories/addressRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import prisma from '@/api-lib/config/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getAddressController(): AddressController {
  const repo = new AddressRepository(prisma);
  const service = new AddressService(repo);
  return new AddressController(service);
}

export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const controller = getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.getAddressById.bind(controller)
  )(request, { params });
};

export const PUT = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const controller = getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.updateAddress.bind(controller)
  )(request, { params });
};

export const DELETE = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  const controller = getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.deleteAddress.bind(controller)
  )(request, { params });
};


