import { NextRequest } from 'next/server';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AddressController } from '@/api-lib/controllers/addressController';
import { AddressService } from '@/api-lib/services/addressService';
import { AddressRepository } from '@/api-lib/repositories/addressRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import prisma from '@/api-lib/config/database';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

const addressRepository = new AddressRepository(prisma);
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  return createNextRouteHandler(authenticateToken, addressController.getAddressById)(request, { params });
};

export const PUT = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  return createNextRouteHandler(authenticateToken, addressController.updateAddress)(request, { params });
};

export const DELETE = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const params = await context.params;
  return createNextRouteHandler(authenticateToken, addressController.deleteAddress)(request, { params });
};


