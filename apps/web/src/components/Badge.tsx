import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Badge({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  onClick,
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    primary: 'bg-[#BFA16A] text-white',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    success:
      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning:
      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const clickableClasses = onClick
    ? 'cursor-pointer hover:opacity-80 transition-opacity'
    : '';

  if (onClick) {
    return (
      <button
        type='button'
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${clickableClasses} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
