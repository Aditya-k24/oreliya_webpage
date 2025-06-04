import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/tokenUtils.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  res.json({ token: generateToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user) });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});
