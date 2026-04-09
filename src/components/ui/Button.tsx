'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

  const variantStyles: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
    secondary:
      'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25',
    outline:
      'border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30',
    ghost:
      'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-3 text-base min-h-[44px]',
    lg: 'px-7 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[64px]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
