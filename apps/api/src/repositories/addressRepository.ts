import { PrismaClient } from '@prisma/client';
import { CreateAddressRequest, UpdateAddressRequest } from '../types/address';

export class AddressRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createAddress(userId: string, data: CreateAddressRequest) {
    return this.prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async getAddressesByUserId(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAddressById(id: string, userId: string) {
    return this.prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async updateAddress(id: string, userId: string, data: UpdateAddressRequest) {
    return this.prisma.address.update({
      where: { id, userId },
      data,
    });
  }

  async deleteAddress(id: string, userId: string) {
    return this.prisma.address.delete({
      where: { id, userId },
    });
  }
}
