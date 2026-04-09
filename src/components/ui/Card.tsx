'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  onClick,
  role,
  ariaLabel,
  hoverable = false,
}: CardProps) {
  const interactive = onClick || hoverable;
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm ${
        interactive
          ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400'
          : ''
      } ${className}`}
    >
      {children}
    </Component>
  );
}
