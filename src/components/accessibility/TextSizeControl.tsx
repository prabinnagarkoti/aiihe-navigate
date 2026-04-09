'use client';

import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { AArrowUp, AArrowDown } from 'lucide-react';

export default function TextSizeControl() {
  const { textSizeMultiplier, setTextSizeMultiplier } = useAccessibility();

  const increase = () => setTextSizeMultiplier(Math.min(textSizeMultiplier + 0.1, 2));
  const decrease = () => setTextSizeMultiplier(Math.max(textSizeMultiplier - 0.1, 1));
  const percentage = Math.round(textSizeMultiplier * 100);

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Text size controls"
    >
      <button
        onClick={decrease}
        disabled={textSizeMultiplier <= 1}
        aria-label="Decrease text size"
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <AArrowDown size={18} aria-hidden="true" />
      </button>

      <span
        className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px] text-center"
        aria-live="polite"
        aria-label={`Text size ${percentage} percent`}
      >
        {percentage}%
      </span>

      <button
        onClick={increase}
        disabled={textSizeMultiplier >= 2}
        aria-label="Increase text size"
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <AArrowUp size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
