import { Router, Router as ExpressRouter } from 'express';
import healthRoutes from './healthRoutes';

const router: ExpressRouter = Router();

// Health routes
router.use('/health', healthRoutes);

// API routes
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Oreliya API!' });
});

export default router;
