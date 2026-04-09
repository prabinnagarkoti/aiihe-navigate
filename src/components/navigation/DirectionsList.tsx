'use client';

import React from 'react';
import { RouteStep } from '@/types';
import {
  ArrowRight,
  Footprints,
  ArrowUpDown,
  ChevronsUp,
  MoveRight,
} from 'lucide-react';

interface DirectionsListProps {
  steps: RouteStep[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

function getStepIcon(type: RouteStep['pathType']) {
  switch (type) {
    case 'ramp':
      return <MoveRight size={18} className="text-emerald-500" />;
    case 'elevator':
      return <ArrowUpDown size={18} className="text-blue-500" />;
    case 'stairs':
      return <ChevronsUp size={18} className="text-amber-500" />;
    case 'corridor':
      return <ArrowRight size={18} className="text-purple-500" />;
    default:
      return <Footprints size={18} className="text-gray-500" />;
  }
}

export default function DirectionsList({
  steps,
  currentStepIndex,
  onStepClick,
}: DirectionsListProps) {
  if (steps.length === 0) return null;

  return (
    <nav aria-label="Route directions" className="space-y-2">
      <h3 className="sr-only">Step-by-step directions</h3>
      <ol className="space-y-2">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <li key={idx}>
              <button
                onClick={() => onStepClick?.(idx)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-600 shadow-sm'
                    : isCompleted
                    ? 'bg-gray-50 dark:bg-gray-800/50 opacity-60'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700'
                }`}
              >
                {/* Step number */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getStepIcon(step.pathType)}
                    <span
                      className={`font-medium text-sm ${
                        isCurrent
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {step.instruction}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {step.distance}m
                    </span>
                    {step.accessible && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        ♿ Accessible
                      </span>
                    )}
                    {!step.accessible && (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        ⚠ Not accessible
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
