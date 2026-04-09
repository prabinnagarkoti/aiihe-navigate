'use client';

import React from 'react';
import WatchFace from '@/components/smartwatch/WatchFace';
import { useNavigation } from '@/contexts/NavigationContext';

export default function SmartWatchPage() {
  const { currentRoute, currentStepIndex } = useNavigation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smartwatch View</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This simulates how the navigation interface would appear on a paired smartwatch device.
        </p>

        {/* The WatchFace component handles its own layout, but we wrap it to ensure it looks good framed */}
        <div className="flex justify-center border-4 border-gray-200 dark:border-gray-800 rounded-full p-2 mx-auto w-fit bg-black">
          <div className="transform scale-[1.1]">
            <WatchFace 
              route={currentRoute} 
              currentStepIndex={currentStepIndex} 
            />
          </div>
        </div>
        
        {!currentRoute && (
          <p className="text-sm text-gray-500 mt-6 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl">
            💡 Tip: Go to the Route Planner to start a route, then come back here to see it on the watch!
          </p>
        )}
      </div>
    </div>
  );
}
