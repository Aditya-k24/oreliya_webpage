import { Router, Router as ExpressRouter } from 'express';
import { getHealth } from '../controllers/healthController';
import { asyncWrapper } from '../middlewares/asyncWrapper';

const router: ExpressRouter = Router();

// GET /api/health
router.get('/', asyncWrapper(getHealth));

export default router;
