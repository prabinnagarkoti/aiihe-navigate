'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation2, MapPin, ArrowDownUp } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { calculateRoute } from '@/lib/routing';
import { CampusLocation } from '@/types';
import campusLocations from '@/data/campus-locations.json';
import campusPaths from '@/data/campus-paths.json';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import Card from '@/components/ui/Card';
import RouteInfo from '@/components/navigation/RouteInfo';
import DirectionsList from '@/components/navigation/DirectionsList';

export default function RoutePlannerPage() {
  const router = useRouter();
  const { 
    origin, setOrigin, 
    destination, setDestination,
    currentRoute, setRoute,
    startNavigation,
    userPosition
  } = useNavigation();
  const { wheelchairMode, setWheelchairMode } = useAccessibility();
  
  const [locations] = useState<CampusLocation[]>(campusLocations as CampusLocation[]);
  const [error, setError] = useState<string | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Auto-calculate route when origin, destination, or mode changes
  useEffect(() => {
    // If using current location, we need to create a fake origin node linking to the closest real node
    const effectiveOrigin = useCurrentLocation && userPosition 
      ? { id: 'current-gps', name: 'My Current Location', description: 'Your current external GPS location', type: 'entrance', lat: userPosition.lat, lng: userPosition.lng, accessible: true, icon: 'map-pin', searchTags: [] } as unknown as CampusLocation
      : origin;

    if (effectiveOrigin && destination) {
      if (effectiveOrigin.id === destination.id) {
        setError('Origin and destination cannot be the same.');
        setRoute(null);
        return;
      }
      
      const route = calculateRoute(
        locations, 
        campusPaths as any, 
        useCurrentLocation ? 'bggs-reception' : effectiveOrigin.id, // Route to the reception first if external
        destination.id, 
        wheelchairMode
      );
      
      if (route) {
        // If coming from off-campus, prepend a macro-route step to the school entrance
        if (useCurrentLocation && userPosition) {
            const entrance = locations.find(l => l.id === 'bggs-reception')!;
            const dist = Math.round(
              Math.sqrt(Math.pow(userPosition.lat - entrance.lat, 2) + Math.pow(userPosition.lng - entrance.lng, 2)) * 111320
            );
            route.steps.unshift({
                instruction: `Navigate via Brisbane streets to BGGS Reception Main Entrance`,
                distance: dist,
                fromLocation: effectiveOrigin,
                toLocation: entrance,
                pathType: 'path',
                accessible: true
            });
            route.totalDistance += dist;
            route.estimatedTime += Math.round(dist / 80);
            route.path.unshift(effectiveOrigin);
        }

        setRoute(route);
        setError(null);
      } else {
        setRoute(null);
        setError('No accessible route found between these locations.');
      }
    } else {
      setRoute(null);
      setError(null);
    }
  }, [origin, destination, wheelchairMode, locations, setRoute, useCurrentLocation, userPosition]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleStartNav = () => {
    if (origin && destination && currentRoute) {
      startNavigation(origin, destination, currentRoute);
      router.push('/navigate');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Route Planner</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Find the best way around campus.
      </p>

      <Card className="z-10 relative">
        <div className="space-y-4">
          {/* Origin Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="origin" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Start point
            </label>
            <select
              id="origin"
              value={useCurrentLocation ? 'current-gps' : (origin?.id || '')}
              onChange={(e) => {
                if (e.target.value === 'current-gps') {
                    setUseCurrentLocation(true);
                    setOrigin(null);
                } else {
                    setUseCurrentLocation(false);
                    const loc = locations.find(l => l.id === e.target.value);
                    setOrigin(loc || null);
                }
              }}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <option value="">Select starting location...</option>
              <option value="current-gps" className="font-bold text-blue-600">📍 My Current GPS Location</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div className="relative h-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <button
              onClick={handleSwap}
              aria-label="Swap locations"
              className="relative bg-white dark:bg-gray-800 p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <ArrowDownUp size={16} />
            </button>
          </div>

          {/* Destination Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="destination" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Destination
            </label>
            <select
              id="destination"
              value={destination?.id || ''}
              onChange={(e) => {
                const loc = locations.find(l => l.id === e.target.value);
                setDestination(loc || null);
              }}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            >
              <option value="">Select destination...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* Accessibility Toggle */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <Toggle
              id="route-wheelchair-mode"
              checked={wheelchairMode}
              onChange={setWheelchairMode}
              label="Wheelchair Accessible Route"
              description="Avoid all stairs, prefer ramps and elevators."
            />
          </div>
        </div>
      </Card>

      {/* Results Area */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800" role="alert">
          {error}
        </div>
      )}

      {currentRoute && !error && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <RouteInfo route={currentRoute} />
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={<Navigation2 size={20} />}
            onClick={handleStartNav}
            aria-label="Start live navigation for this route"
          >
            Start Direction
          </Button>

          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Route Preview</h2>
            <DirectionsList steps={currentRoute.steps} currentStepIndex={-1} />
          </Card>
        </div>
      )}

      {/* Empty State Help */}
      {!origin && !destination && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <MapPin size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a starting point and destination above to see the route.</p>
        </div>
      )}
    </div>
  );
}
