'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { watchUserPosition, stopWatchingPosition } from '@/lib/geolocation';
import { CampusLocation } from '@/types';
import campusLocations from '@/data/campus-locations.json';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import DirectionsList from '@/components/navigation/DirectionsList';
import VoiceGuidance from '@/components/navigation/VoiceGuidance';
import RouteInfo from '@/components/navigation/RouteInfo';
import { Navigation2, Search, XCircle, Goal } from 'lucide-react';
import L from 'leaflet';

// Dynamically import map components (they rely on window/Leaflet)
const CampusMap = dynamic(() => import('@/components/map/CampusMap'), { ssr: false });
const LocationMarkers = dynamic(() => import('@/components/map/LocationMarkers'), { ssr: false });
const RouteLayer = dynamic(() => import('@/components/map/RouteLayer'), { ssr: false });
const UserLocationMarker = dynamic(() => import('@/components/map/UserLocationMarker'), { ssr: false });

export default function NavigatePage() {
  const router = useRouter();
  const { 
    isNavigating, 
    currentRoute, 
    currentStepIndex, 
    userPosition,
    updateUserPosition,
    stopNavigation,
    setDestination
  } = useNavigation();
  const { voiceGuidance } = useAccessibility();
  
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [locations] = useState<CampusLocation[]>(campusLocations as CampusLocation[]);
  const [sheetOpen, setSheetOpen] = useState(true);

  // Watch user location
  useEffect(() => {
    watchUserPosition((pos) => {
      updateUserPosition(pos);
    });
    return () => stopWatchingPosition();
  }, [updateUserPosition]);

  // Center map on user when finding location
  const handleRecenter = useCallback(() => {
    if (mapInstance && userPosition) {
      mapInstance.setView([userPosition.lat, userPosition.lng], 18, { animate: true });
    }
  }, [mapInstance, userPosition]);

  const handleLocationClick = (loc: CampusLocation) => {
    setDestination(loc);
    router.push('/route-planner');
  };

  const currentStep = currentRoute?.steps[currentStepIndex];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] lg:h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      
      {/* Top Banner for Active Navigation */}
      {isNavigating && currentStep && (
        <div className="absolute top-4 left-4 right-4 z-[400] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
              <Navigation2 size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                Next up • {currentStep.distance}m
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentStep.instruction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 w-full h-full relative z-0">
        <CampusMap onMapReady={setMapInstance}>
          <LocationMarkers locations={locations} onLocationClick={handleLocationClick} />
          {isNavigating && (
            <RouteLayer route={currentRoute} currentStepIndex={currentStepIndex} />
          )}
          <UserLocationMarker position={userPosition} />
        </CampusMap>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-24 md:bottom-8 right-4 z-[400] flex flex-col gap-3">
        <button
          onClick={handleRecenter}
          aria-label="Recenter map on my location"
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
        >
          <Goal size={24} />
        </button>
        
        {!isNavigating && (
          <button
            onClick={() => router.push('/route-planner')}
            aria-label="Plan a route"
            className="p-3 bg-blue-600 rounded-full shadow-lg text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 shadow-blue-500/30"
          >
            <Search size={24} />
          </button>
        )}
      </div>

      {/* Bottom Sheet for Navigation Details */}
      {isNavigating && currentRoute && (
        <BottomSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Route Details"
        >
          <div className="space-y-6">
            <RouteInfo route={currentRoute} />

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
              <VoiceGuidance 
                directions={currentRoute.steps.slice(currentStepIndex).map(s => s.instruction)}
                enabled={voiceGuidance}
              />
              <Button 
                variant="danger" 
                size="sm" 
                icon={<XCircle size={16} />}
                onClick={stopNavigation}
              >
                End Route
              </Button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Steps</h3>
              <DirectionsList 
                steps={currentRoute.steps}
                currentStepIndex={currentStepIndex}
              />
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Re-open sheet button if closed during nav */}
      {isNavigating && !sheetOpen && (
        <div className="absolute bottom-24 md:bottom-8 left-4 z-[400]">
          <Button
            variant="primary"
            onClick={() => setSheetOpen(true)}
            className="shadow-lg"
          >
            Show Route Details
          </Button>
        </div>
      )}
    </div>
  );
}
