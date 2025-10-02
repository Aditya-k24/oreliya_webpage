import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { AddressController } from '@/api-lib/controllers/addressController';
import { AddressService } from '@/api-lib/services/addressService';
import { AddressRepository } from '@/api-lib/repositories/addressRepository';
import { authenticateToken } from '@/api-lib/middlewares/authMiddleware';
import prisma from '@/api-lib/config/database';

const addressRepository = new AddressRepository(prisma);
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

export const GET = createNextRouteHandler(authenticateToken, addressController.getAddresses);
export const POST = createNextRouteHandler(authenticateToken, addressController.createAddress);


