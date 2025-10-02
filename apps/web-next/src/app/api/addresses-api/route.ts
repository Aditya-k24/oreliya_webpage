export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
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

export async function GET(request: NextRequest) {
  const controller = getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.getAddresses.bind(controller)
  )(request);
}

export async function POST(request: NextRequest) {
  const controller = getAddressController();
  return createNextRouteHandler(
    authenticateToken,
    controller.createAddress.bind(controller)
  )(request);
}


