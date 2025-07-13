import { Router, Router as ExpressRouter } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';

const router: ExpressRouter = Router();

// Health routes
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// API routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Oreliya API!' });
});

export default router;
