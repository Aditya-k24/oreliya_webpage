// Production-ready error handling
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    };
  }

  // Log unexpected errors in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Unexpected error:', error);
  }

  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    isOperational: false,
  };
};

export const createErrorResponse = (error: unknown) => {
  const { message, statusCode } = handleError(error);
  
  return {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error instanceof Error ? error.stack : undefined 
    }),
  };
};
