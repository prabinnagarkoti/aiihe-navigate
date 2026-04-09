'use client';

import React from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import { UserPosition } from '@/types';

interface UserLocationMarkerProps {
  position: UserPosition | null;
}

export default function UserLocationMarker({ position }: UserLocationMarkerProps) {
  if (!position) return null;

  return (
    <>
      {/* Accuracy circle */}
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={Math.min(position.accuracy / 2, 40)}
        pathOptions={{
          color: 'rgba(59, 130, 246, 0.3)',
          fillColor: 'rgba(59, 130, 246, 0.1)',
          fillOpacity: 0.3,
          weight: 1,
        }}
      />
      {/* User position dot */}
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={8}
        pathOptions={{
          color: '#ffffff',
          fillColor: '#3b82f6',
          fillOpacity: 1,
          weight: 3,
        }}
      >
        <Popup>
          <div className="text-center">
            <p className="font-semibold">Your Location</p>
            <p className="text-xs text-gray-500">
              Accuracy: ±{Math.round(position.accuracy)}m
            </p>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
