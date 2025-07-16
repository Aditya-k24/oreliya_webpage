import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { AddressController } from '../controllers/addressController';
import { AddressService } from '../services/addressService';
import { AddressRepository } from '../repositories/addressRepository';
import { authenticateToken } from '../middlewares/authMiddleware';
import { prisma } from '../lib/prisma';

const router: ExpressRouter = Router();

// Initialize dependencies
const addressRepository = new AddressRepository(prisma);
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

// All address routes require authentication
router.use(authenticateToken);

// Address routes
router.get('/', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.get('/:id', addressController.getAddressById);

export default router;
