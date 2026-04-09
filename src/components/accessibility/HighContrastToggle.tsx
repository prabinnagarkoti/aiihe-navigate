'use client';

import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Contrast } from 'lucide-react';

export default function HighContrastToggle() {
  const { highContrast, setHighContrast } = useAccessibility();
  const { setTheme } = useTheme();

  const toggleContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    if (newValue) {
      setTheme('high-contrast');
    } else {
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleContrast}
      role="switch"
      aria-checked={highContrast}
      aria-label={`High contrast mode: ${highContrast ? 'on' : 'off'}`}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 min-h-[44px] ${
        highContrast
          ? 'bg-yellow-400 text-black border-2 border-black'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Contrast size={20} aria-hidden="true" />
      <span className="text-sm">
        {highContrast ? 'High Contrast On' : 'High Contrast'}
      </span>
    </button>
  );
}
