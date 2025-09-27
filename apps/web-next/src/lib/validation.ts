// Production-ready input validation
import { AppError } from './error-handler';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFileUpload = (file: File, maxSize: number = 10 * 1024 * 1024, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']) => {
  if (file.size > maxSize) {
    throw new AppError(`File size must be less than ${maxSize / 1024 / 1024}MB`, 400);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new AppError(`File type must be one of: ${allowedTypes.join(', ')}`, 400);
  }
  
  return true;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
