import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CreateAddressRequest, UpdateAddressRequest } from '../types/address';

export class AddressRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createAddress(userId: string, data: CreateAddressRequest) {
    return this.prisma.addresses.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        userId,
        ...data,
      },
    });
  }

  async getAddressesByUserId(userId: string) {
    return this.prisma.addresses.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAddressById(id: string, userId: string) {
    return this.prisma.addresses.findFirst({
      where: { id, userId },
    });
  }

  async updateAddress(id: string, userId: string, data: UpdateAddressRequest) {
    return this.prisma.addresses.update({
      where: { id, userId },
      data,
    });
  }

  async deleteAddress(id: string, userId: string) {
    return this.prisma.addresses.delete({
      where: { id, userId },
    });
  }
}
