'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CampusLocation } from '@/types';

interface LocationMarkersProps {
  locations: CampusLocation[];
  onLocationClick?: (location: CampusLocation) => void;
}

function createCustomIcon(location: CampusLocation): L.DivIcon {
  const colors: Record<string, string> = {
    entrance: '#10b981',
    building: '#3b82f6',
    lecture: '#8b5cf6',
    amenity: '#f59e0b',
    parking: '#6366f1',
    facility: '#14b8a6',
  };

  const color = colors[location.type] || '#6b7280';

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">${location.accessible ? '♿' : '📍'}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'custom-marker',
  });
}

export default function LocationMarkers({ locations, onLocationClick }: LocationMarkersProps) {
  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={createCustomIcon(location)}
          eventHandlers={{
            click: () => onLocationClick?.(location),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-base mb-1">{location.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{location.description}</p>
              {location.accessible ? (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  ♿ Wheelchair Accessible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  ⚠ Limited Accessibility
                </span>
              )}
              {location.accessibilityNotes && (
                <p className="text-xs text-gray-500 mt-1">{location.accessibilityNotes}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
