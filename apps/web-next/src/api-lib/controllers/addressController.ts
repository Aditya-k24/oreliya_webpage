import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../services/addressService';
import { CreateAddressRequest, UpdateAddressRequest } from '../types/address';
import { AuthenticatedRequest } from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';

export class AddressController {
  private addressService: AddressService;

  constructor(addressService: AddressService) {
    this.addressService = addressService;
  }

  // GET /api/addresses - Get user's addresses
  getAddresses = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const result = await this.addressService.getAddresses(userId);
      return res.status(200).json(result);
    }
  );

  // POST /api/addresses - Create new address
  createAddress = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const data: CreateAddressRequest = req.body;
      const result = await this.addressService.createAddress(userId, data);
      return res.status(201).json(result);
    }
  );

  // GET /api/addresses/:id - Get address by ID
  getAddressById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { id } = req.params;
      const result = await this.addressService.getAddressById(id, userId);
      return res.status(200).json(result);
    }
  );

  // PUT /api/addresses/:id - Update address
  updateAddress = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { id } = req.params;
      const data: UpdateAddressRequest = req.body;
      const result = await this.addressService.updateAddress(id, userId, data);
      return res.status(200).json(result);
    }
  );

  // DELETE /api/addresses/:id - Delete address
  deleteAddress = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user.id;
      const { id } = req.params;
      const result = await this.addressService.deleteAddress(id, userId);
      return res.status(200).json(result);
    }
  );
}
