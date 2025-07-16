import { Router } from 'express';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { authenticateToken } from '../middlewares/authMiddleware';
import { AdminController } from '../controllers/adminController';
import { prisma } from '../lib/prisma';

const router: import('express').Router = Router();
const adminController = new AdminController(prisma);

// All admin routes require authentication and admin role
router.use(authenticateToken, adminMiddleware);

// Stats
router.get('/stats', adminController.getStats.bind(adminController));

// Deals CRUD
router.get('/deals', adminController.listDeals.bind(adminController));
router.post('/deals', adminController.createDeal.bind(adminController));
router.put('/deals/:id', adminController.updateDeal.bind(adminController));
router.delete('/deals/:id', adminController.deleteDeal.bind(adminController));

// Customization Presets CRUD
router.get(
  '/customizations',
  adminController.listCustomizations.bind(adminController)
);
router.post(
  '/customizations',
  adminController.createCustomization.bind(adminController)
);
router.put(
  '/customizations/:id',
  adminController.updateCustomization.bind(adminController)
);
router.delete(
  '/customizations/:id',
  adminController.deleteCustomization.bind(adminController)
);

// Role Management CRUD
router.get('/roles', adminController.listRoles.bind(adminController));
router.post('/roles', adminController.createRole.bind(adminController));
router.put('/roles/:id', adminController.updateRole.bind(adminController));
router.delete('/roles/:id', adminController.deleteRole.bind(adminController));

export default router;
