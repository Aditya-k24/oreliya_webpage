import express from 'express';
import { createOrder, getOrders, getDummyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getOrders);

router.get('/dummy', getDummyOrders);

export default router;
