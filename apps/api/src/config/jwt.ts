import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const JWT_CONFIG = {
  ACCESS_TOKEN_SECRET:
    process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
  REFRESH_TOKEN_SECRET:
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const generateAccessToken = (
  payload: Omit<JWTPayload, 'type'>
): string => {
  return jwt.sign(
    { ...payload, type: 'access' as const },
    JWT_CONFIG.ACCESS_TOKEN_SECRET,
    { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
  );
};

export const generateRefreshToken = (
  payload: Omit<JWTPayload, 'type'>
): string => {
  return jwt.sign(
    { ...payload, type: 'refresh' as const },
    JWT_CONFIG.REFRESH_TOKEN_SECRET,
    { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_CONFIG.REFRESH_TOKEN_SECRET) as JWTPayload;
};

export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
