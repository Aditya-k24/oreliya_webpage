import { AddressRepository } from '../repositories/addressRepository';
import {
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
} from '../types/address';
import { CustomError } from '../utils/errors';

export class AddressService {
  private addressRepository: AddressRepository;

  constructor(addressRepository: AddressRepository) {
    this.addressRepository = addressRepository;
  }

  async createAddress(
    userId: string,
    data: CreateAddressRequest
  ): Promise<AddressResponse> {
    // Validate required fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.addressLine1 ||
      !data.city ||
      !data.state ||
      !data.postalCode ||
      !data.country
    ) {
      throw new CustomError('Missing required address fields', 400);
    }

    const address = await this.addressRepository.createAddress(userId, data);

    return {
      success: true,
      data: { address: address as any },
      message: 'Address created successfully',
    };
  }

  async getAddresses(userId: string): Promise<AddressResponse> {
    const addresses = await this.addressRepository.getAddressesByUserId(userId);

    return {
      success: true,
      data: { addresses: addresses as any },
    };
  }

  async getAddressById(id: string, userId: string): Promise<AddressResponse> {
    const address = await this.addressRepository.getAddressById(id, userId);

    if (!address) {
      throw new CustomError('Address not found', 404);
    }

    return {
      success: true,
      data: { address: address as any },
    };
  }

  async updateAddress(
    id: string,
    userId: string,
    data: UpdateAddressRequest
  ): Promise<AddressResponse> {
    // Check if address exists
    const existingAddress = await this.addressRepository.getAddressById(
      id,
      userId
    );
    if (!existingAddress) {
      throw new CustomError('Address not found', 404);
    }

    const address = await this.addressRepository.updateAddress(
      id,
      userId,
      data
    );

    return {
      success: true,
      data: { address: address as any },
      message: 'Address updated successfully',
    };
  }

  async deleteAddress(id: string, userId: string): Promise<AddressResponse> {
    // Check if address exists
    const existingAddress = await this.addressRepository.getAddressById(
      id,
      userId
    );
    if (!existingAddress) {
      throw new CustomError('Address not found', 404);
    }

    await this.addressRepository.deleteAddress(id, userId);

    return {
      success: true,
      data: {},
      message: 'Address deleted successfully',
    };
  }
}
