'use client';

import React from 'react';
import { Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { Route } from '@/types';

interface RouteLayerProps {
  route: Route | null;
  currentStepIndex?: number;
}

export default function RouteLayer({ route, currentStepIndex = 0 }: RouteLayerProps) {
  if (!route || route.path.length === 0) return null;

  const coordinates: [number, number][] = route.path.map((loc) => [loc.lat, loc.lng]);

  // Split into completed and remaining
  const completedCoords = coordinates.slice(0, currentStepIndex + 1);
  const remainingCoords = coordinates.slice(currentStepIndex);

  return (
    <>
      {/* Completed portion (dimmed) */}
      {completedCoords.length > 1 && (
        <Polyline
          positions={completedCoords}
          pathOptions={{
            color: '#94a3b8',
            weight: 5,
            opacity: 0.5,
            dashArray: '8, 8',
          }}
        />
      )}

      {/* Remaining route (bright) */}
      {remainingCoords.length > 1 && (
        <>
          {/* Shadow line */}
          <Polyline
            positions={remainingCoords}
            pathOptions={{
              color: '#1e40af',
              weight: 8,
              opacity: 0.3,
            }}
          />
          {/* Main line */}
          <Polyline
            positions={remainingCoords}
            pathOptions={{
              color: '#3b82f6',
              weight: 5,
              opacity: 0.9,
            }}
          />
        </>
      )}

      {/* Step markers */}
      {route.path.map((loc, idx) => (
        <CircleMarker
          key={`step-${loc.id}-${idx}`}
          center={[loc.lat, loc.lng]}
          radius={idx === 0 || idx === route.path.length - 1 ? 8 : 5}
          pathOptions={{
            color: idx <= currentStepIndex ? '#94a3b8' : '#3b82f6',
            fillColor:
              idx === 0
                ? '#10b981'
                : idx === route.path.length - 1
                ? '#ef4444'
                : idx <= currentStepIndex
                ? '#94a3b8'
                : '#ffffff',
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            <span className="font-medium">{loc.name}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}
