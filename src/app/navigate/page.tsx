'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { watchUserPosition, stopWatchingPosition } from '@/lib/geolocation';
import { CampusLocation, UserPosition } from '@/types';
import campusLocations from '@/data/campus-locations.json';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import DirectionsList from '@/components/navigation/DirectionsList';
import VoiceGuidance from '@/components/navigation/VoiceGuidance';
import RouteInfo from '@/components/navigation/RouteInfo';
import { Navigation2, Search, XCircle, Goal, MousePointerClick } from 'lucide-react';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';

// Dynamically import map components (they rely on window/Leaflet)
const CampusMap = dynamic(() => import('@/components/map/CampusMap'), { ssr: false });
const LocationMarkers = dynamic(() => import('@/components/map/LocationMarkers'), { ssr: false });
const RouteLayer = dynamic(() => import('@/components/map/RouteLayer'), { ssr: false });
const UserLocationMarker = dynamic(() => import('@/components/map/UserLocationMarker'), { ssr: false });

// Helper to calculate distance in meters between two lat/lngs
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function TapToWalkEvents({ demoMode, onMapClick }: { demoMode: boolean, onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (demoMode) onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function NavigatePage() {
  const router = useRouter();
  const { 
    isNavigating, 
    currentRoute, 
    currentStepIndex, 
    userPosition,
    updateUserPosition,
    stopNavigation,
    setDestination,
    nextStep
  } = useNavigation();
  const { voiceGuidance } = useAccessibility();
  
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [locations] = useState<CampusLocation[]>(campusLocations as CampusLocation[]);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  // Watch user location (only if not in demo mode)
  useEffect(() => {
    if (!demoMode) {
      watchUserPosition((pos) => {
        updateUserPosition(pos);
      });
      return () => stopWatchingPosition();
    } else {
      stopWatchingPosition();
    }
  }, [demoMode, updateUserPosition]);

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

  // Handle map click during demo mode to simulate walking
  const handleMapClick = useCallback((lat: number, lng: number) => {
    const fakePos: UserPosition = {
      lat, lng, accuracy: 5, heading: null, timestamp: Date.now()
    };
    updateUserPosition(fakePos);

    // Auto-advance route if we tap close to the current step's destination (geofence detection)
    if (isNavigating && currentStep) {
      const dist = calculateDistance(lat, lng, currentStep.toLocation.lat, currentStep.toLocation.lng);
      if (dist < 15) { // within 15 meters
        nextStep();
      }
    }
  }, [updateUserPosition, isNavigating, currentStep, nextStep]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] lg:h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      
      {/* Top Banner for Active Navigation */}
      {isNavigating && currentStep && (
        <div className="absolute top-4 left-4 right-4 z-[400] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-95"></div>
          <div className="relative p-5 shadow-2xl rounded-2xl border border-white/20 text-white flex flex-col gap-3">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-4 rounded-2xl shadow-inner backdrop-blur-md">
                <Navigation2 size={32} className="text-white drop-shadow-md" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-widest mb-1">
                  In {currentStep.distance}m
                </p>
                <p className="text-2xl font-bold leading-tight drop-shadow-md">
                  {currentStep.instruction}
                </p>
              </div>
            </div>
            {/* Massive explicit voice nav toggle */}
            <div className="pt-2 border-t border-white/20 mt-1 flex justify-between items-center">
              <VoiceGuidance 
                directions={currentRoute.steps.slice(currentStepIndex).map(s => s.instruction)}
                enabled={voiceGuidance}
              />
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Turn-by-turn Active</span>
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
          <TapToWalkEvents demoMode={demoMode} onMapClick={handleMapClick} />
        </CampusMap>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-24 md:bottom-8 right-4 z-[400] flex flex-col gap-3">
        {/* Presentation Demo Toggle */}
        <button
          onClick={() => setDemoMode(!demoMode)}
          className={`p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 transition-colors ${demoMode ? 'bg-indigo-600 text-white animate-pulse' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50'}`}
          aria-label="Toggle Demo Walk Mode"
          title="Toggle Demo Tap-to-Walk Simulation"
        >
          <MousePointerClick size={24} />
        </button>

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
