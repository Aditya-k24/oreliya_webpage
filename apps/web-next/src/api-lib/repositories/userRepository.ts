import { PrismaClient, User, Role } from '@prisma/client';
import { UserWithoutPassword } from '../types/auth';
import logger from '../config/logger';

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
  }): Promise<User & { role: Role }> {
    try {
      const user = await this.prisma.user.create({
        data: userData,
        include: {
          role: true,
        },
      });
      logger.info(`User created: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async findUserById(id: string): Promise<(User & { role: Role }) | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        include: {
          role: true,
        },
      });
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findUserByEmail(
    email: string
  ): Promise<(User & { role: Role }) | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        include: {
          role: true,
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
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          emailVerified: true,
          role: {
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

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        include: {
          role: true,
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
      await this.prisma.user.delete({
        where: { id },
      });
      logger.info(`User deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async findRoleByName(name: string): Promise<Role | null> {
    try {
      return await this.prisma.role.findUnique({
        where: { name },
      });
    } catch (error) {
      logger.error('Error finding role by name:', error);
      throw error;
    }
  }

  async findRoleById(id: string): Promise<Role | null> {
    try {
      return await this.prisma.role.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error finding role by ID:', error);
      throw error;
    }
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.prisma.role.findMany();
    } catch (error) {
      logger.error('Error getting all roles:', error);
      throw error;
    }
  }

  async createRole(roleData: {
    name: string;
    description?: string;
  }): Promise<Role> {
    try {
      const role = await this.prisma.role.create({
        data: roleData,
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
      const count = await this.prisma.user.count({
        where: { email },
      });
      return count > 0;
    } catch (error) {
      logger.error('Error checking if user exists:', error);
      throw error;
    }
  }
}
