import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class AdminController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // GET /api/admin/stats
  async getStats(req: Request, res: Response) {
    // Daily sales (last 7 days)
    const sales = await this.prisma.order.groupBy({
      by: ['createdAt'],
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'asc' },
    });
    // Top products (by quantity sold)
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });
    // Inventory low alert (stockQuantity < 5)
    const lowInventory = await this.prisma.productVariant.findMany({
      where: { stockQuantity: { lt: 5 } },
      select: {
        id: true,
        productId: true,
        size: true,
        material: true,
        stockQuantity: true,
      },
      orderBy: { stockQuantity: 'asc' },
      take: 10,
    });
    res.json({
      success: true,
      data: { sales, topProducts, lowInventory },
    });
  }

  // Deals CRUD
  async listDeals(req: Request, res: Response) {
    const { page = 1, limit = 20 } = req.query;
    const deals = await this.prisma.deal.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const total = await this.prisma.deal.count();
    res.json({ success: true, data: { deals, total } });
  }

  async createDeal(req: Request, res: Response) {
    const deal = await this.prisma.deal.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: { deal } });
  }

  async updateDeal(req: Request, res: Response) {
    const deal = await this.prisma.deal.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: { deal } });
  }

  async deleteDeal(req: Request, res: Response) {
    await this.prisma.deal.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  }

  // Customization Presets CRUD
  async listCustomizations(req: Request, res: Response) {
    const { page = 1, limit = 20 } = req.query;
    const customizations = await this.prisma.productCustomization.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });
    const total = await this.prisma.productCustomization.count();
    res.json({ success: true, data: { customizations, total } });
  }

  async createCustomization(req: Request, res: Response) {
    const customization = await this.prisma.productCustomization.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: { customization } });
  }

  async updateCustomization(req: Request, res: Response) {
    const customization = await this.prisma.productCustomization.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: { customization } });
  }

  async deleteCustomization(req: Request, res: Response) {
    await this.prisma.productCustomization.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  }

  // Role Management CRUD
  async listRoles(req: Request, res: Response) {
    const roles = await this.prisma.role.findMany();
    res.json({ success: true, data: { roles } });
  }

  async createRole(req: Request, res: Response) {
    const role = await this.prisma.role.create({ data: req.body });
    res.status(201).json({ success: true, data: { role } });
  }

  async updateRole(req: Request, res: Response) {
    const role = await this.prisma.role.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: { role } });
  }

  async deleteRole(req: Request, res: Response) {
    await this.prisma.role.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  }
}
