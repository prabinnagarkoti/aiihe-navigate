'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  id: string;
}

export default function Toggle({ checked, onChange, label, description, id }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="font-medium text-gray-900 dark:text-white cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
