import { PrismaClient, users, roles } from '@prisma/client';
import { UserWithoutPassword } from '../types/auth';
import logger from '../config/logger';
import { randomUUID } from 'crypto';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleId: string;
  }): Promise<users & { roles: roles }> {
    try {
      const user = await this.prisma.users.create({
        data: {
          ...userData,
          id: randomUUID(),
          updatedAt: new Date(),
        },
        include: {
          roles: true,
        },
      });
      logger.info(`User created: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async findUserById(id: string): Promise<(users & { roles: roles }) | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { id },
        include: {
          roles: true,
        },
      });
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findUserByEmail(
    email: string
  ): Promise<(users & { roles: roles }) | null> {
    try {
      return await this.prisma.users.findUnique({
        where: { email },
        include: {
          roles: true,
        },
      });
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findUserWithoutPassword(
    id: string
  ): Promise<UserWithoutPassword | null> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          emailVerified: true,
          roles: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      logger.error('Error finding user without password:', error);
      throw error;
    }
  }

  async updateUser(id: string, data: Partial<users>): Promise<users> {
    try {
      const user = await this.prisma.users.update({
        where: { id },
        data,
        include: {
          roles: true,
        },
      });
      logger.info(`User updated: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.prisma.users.delete({
        where: { id },
      });
      logger.info(`User deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async findRoleByName(name: string): Promise<roles | null> {
    try {
      return await this.prisma.roles.findUnique({
        where: { name },
      });
    } catch (error) {
      logger.error('Error finding role by name:', error);
      throw error;
    }
  }

  async findRoleById(id: string): Promise<roles | null> {
    try {
      return await this.prisma.roles.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error finding role by ID:', error);
      throw error;
    }
  }

  async getAllRoles(): Promise<roles[]> {
    try {
      return await this.prisma.roles.findMany();
    } catch (error) {
      logger.error('Error getting all roles:', error);
      throw error;
    }
  }

  async createRole(roleData: {
    name: string;
    description?: string;
  }): Promise<roles> {
    try {
      const role = await this.prisma.roles.create({
        data: {
          ...roleData,
          id: randomUUID(),
          updatedAt: new Date(),
        },
      });
      logger.info(`Role created: ${role.name}`);
      return role;
    } catch (error) {
      logger.error('Error creating role:', error);
      throw error;
    }
  }

  async userExists(email: string): Promise<boolean> {
    try {
      const count = await this.prisma.users.count({
        where: { email },
      });
      return count > 0;
    } catch (error) {
      logger.error('Error checking if user exists:', error);
      throw error;
    }
  }
}
