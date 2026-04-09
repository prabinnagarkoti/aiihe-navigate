'use client';

import React from 'react';
import { Route } from '@/types';
import { formatDistance, formatTime, triggerHaptic } from '@/lib/utils';
import {
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  Navigation2,
  Vibrate,
} from 'lucide-react';

interface WatchFaceProps {
  route: Route | null;
  currentStepIndex: number;
}

export default function WatchFace({ route, currentStepIndex }: WatchFaceProps) {
  const currentStep = route?.steps[currentStepIndex];
  const nextStep = route?.steps[currentStepIndex + 1];

  const handleVibrate = () => {
    triggerHaptic([100, 50, 100]);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div
        className="relative w-[250px] h-[250px] rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-gray-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
        role="region"
        aria-label="Smartwatch navigation view"
      >
        {/* Watch bezel effect */}
        <div className="absolute inset-1 rounded-full border border-gray-700/50" />

        {route && currentStep ? (
          <>
            {/* Direction arrow */}
            <div className="mb-2">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Navigation2
                  size={32}
                  className="text-blue-400"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Current instruction */}
            <p className="text-white text-xs font-medium text-center px-6 leading-tight max-w-[180px]">
              {currentStep.toLocation.name}
            </p>

            {/* Distance */}
            <p className="text-blue-400 text-lg font-bold mt-1">
              {formatDistance(currentStep.distance)}
            </p>

            {/* Next turn preview */}
            {nextStep && (
              <div className="flex items-center gap-1 mt-2 px-3 py-1 bg-gray-800 rounded-full">
                <ArrowRight size={12} className="text-yellow-400" />
                <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                  Then: {nextStep.toLocation.name}
                </span>
              </div>
            )}

            {/* Step indicator */}
            <div className="absolute bottom-6 flex items-center gap-1.5">
              {route.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    idx === currentStepIndex
                      ? 'bg-blue-400'
                      : idx < currentStepIndex
                      ? 'bg-emerald-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Vibrate button */}
            <button
              onClick={handleVibrate}
              className="absolute top-5 right-5 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Trigger vibration alert"
            >
              <Vibrate size={14} className="text-gray-400" />
            </button>
          </>
        ) : (
          /* No active route */
          <div className="text-center px-8">
            <Navigation2
              size={28}
              className="text-gray-600 mx-auto mb-3"
              aria-hidden="true"
            />
            <p className="text-gray-400 text-xs font-medium">
              No Active Route
            </p>
            <p className="text-gray-600 text-[10px] mt-1">
              Start navigation from the Route Planner
            </p>
          </div>
        )}

        {/* Time display */}
        <div className="absolute top-5 left-5">
          <span className="text-[10px] text-gray-500 font-mono">
            {new Date().toLocaleTimeString('en-AU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
