import { Request, Response, NextFunction } from 'express';

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Request/Response types
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

// Service types
type Id = string | number;
export interface BaseService<T = unknown, F = Record<string, unknown>> {
  create(data: Partial<T>): Promise<T>;
  findById(id: Id): Promise<T | null>;
  findAll(filters?: F): Promise<T[]>;
  update(id: Id, data: Partial<T>): Promise<T>;
  delete(id: Id): Promise<boolean>;
}

// Repository types
export interface BaseRepository<T = unknown, F = Record<string, unknown>> {
  create(data: Partial<T>): Promise<T>;
  findById(id: Id): Promise<T | null>;
  findAll(filters?: F): Promise<T[]>;
  update(id: Id, data: Partial<T>): Promise<T>;
  delete(id: Id): Promise<boolean>;
}

// Controller types
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type SyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Health check types
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

// Logger types
export interface LogLevel {
  error: 0;
  warn: 1;
  info: 2;
  http: 3;
  debug: 4;
}

export interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}
