import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import dummyOrders from '../data/dummyOrders.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    user: req.user.id,
    items: req.body.items,
    shippingAddress: req.body.shippingAddress,
    totalAmount: req.body.totalAmount,
    paymentStatus: 'Paid',
  });
  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

export const getDummyOrders = asyncHandler(async (_req, res) => {
  res.json(dummyOrders);
});
