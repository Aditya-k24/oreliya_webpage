import { AppError } from '../types';

export class CustomError extends Error implements AppError {
  public statusCode: number;

  public isOperational: boolean;

  public code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request', code?: string) {
    super(message, 400, true, code);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized', code?: string) {
    super(message, 401, true, code);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden', code?: string) {
    super(message, 403, true, code);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found', code?: string) {
    super(message, 404, true, code);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Conflict', code?: string) {
    super(message, 409, true, code);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Validation Error', code?: string) {
    super(message, 422, true, code);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = 'Internal Server Error', code?: string) {
    super(message, 500, true, code);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = 'Service Unavailable', code?: string) {
    super(message, 503, true, code);
  }
}

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof CustomError) {
    return error.isOperational;
  }
  return false;
};
