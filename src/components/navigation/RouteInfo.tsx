'use client';

import React from 'react';
import { Route } from '@/types';
import { formatDistance, formatTime } from '@/lib/utils';
import { Clock, Ruler, Accessibility, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RouteInfoProps {
  route: Route;
}

export default function RouteInfo({ route }: RouteInfoProps) {
  return (
    <div
      className="grid grid-cols-3 gap-3"
      role="region"
      aria-label="Route information"
    >
      {/* Distance */}
      <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
        <Ruler size={20} className="text-blue-600 dark:text-blue-400 mb-1" aria-hidden="true" />
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
          {formatDistance(route.totalDistance)}
        </span>
        <span className="text-xs text-blue-600/70 dark:text-blue-400/70">Distance</span>
      </div>

      {/* Time */}
      <div className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
        <Clock size={20} className="text-emerald-600 dark:text-emerald-400 mb-1" aria-hidden="true" />
        <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
          {formatTime(route.estimatedTime)}
        </span>
        <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Est. Time</span>
      </div>

      {/* Accessibility */}
      <div
        className={`flex flex-col items-center p-3 rounded-xl ${
          route.isFullyAccessible
            ? 'bg-teal-50 dark:bg-teal-900/30'
            : 'bg-amber-50 dark:bg-amber-900/30'
        }`}
      >
        {route.isFullyAccessible ? (
          <>
            <CheckCircle2 size={20} className="text-teal-600 dark:text-teal-400 mb-1" aria-hidden="true" />
            <span className="text-lg font-bold text-teal-700 dark:text-teal-300">♿</span>
            <span className="text-xs text-teal-600/70 dark:text-teal-400/70">Accessible</span>
          </>
        ) : (
          <>
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 mb-1" aria-hidden="true" />
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">⚠</span>
            <span className="text-xs text-amber-600/70 dark:text-amber-400/70">Partial</span>
          </>
        )}
      </div>
    </div>
  );
}
