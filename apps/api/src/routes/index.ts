import { Router, Router as ExpressRouter } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import wishlistRoutes from './wishlistRoutes';
import orderRoutes from './orderRoutes';
import webhookRoutes from './webhookRoutes';
import addressRoutes from './addressRoutes';

const router: ExpressRouter = Router();

// Health routes
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Product routes
router.use('/products', productRoutes);

// Cart routes
router.use('/cart', cartRoutes);

// Wishlist routes
router.use('/wishlist', wishlistRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Address routes
router.use('/addresses', addressRoutes);

// Webhook routes
router.use('/webhooks', webhookRoutes);

// API routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Oreliya API!' });
});

export default router;
