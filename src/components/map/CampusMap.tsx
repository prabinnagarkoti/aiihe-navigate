'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, ZoomControl, useMap, TileLayer, Polygon, Rectangle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// BGGS Junior Campus center coordinates (-27.4588, 153.0245)
const CAMPUS_CENTER: [number, number] = [-27.4588, 153.0245];
// Create bounds around the center to pin the blueprint image onto
const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [-27.4595, 153.0238], // Southwest corner
  [-27.4582, 153.0252], // Northeast corner
];

// Campus Footprint Geometry
const campusFootprint: [number, number][] = [
  [-27.4582, 153.0238],
  [-27.4582, 153.0252],
  [-27.4595, 153.0252],
  [-27.4595, 153.0238],
];

const DEFAULT_ZOOM = 18;

interface CampusMapProps {
  children?: React.ReactNode;
  className?: string;
  center?: [number, number];
  zoom?: number;
  onMapReady?: (map: L.Map) => void;
}

function MapReadyHandler({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
  const map = useMap();
  const called = useRef(false);

  useEffect(() => {
    if (!called.current && onMapReady) {
      // We removed strict panning restrictions to allow users to view surrounding city streets
      onMapReady(map);
      called.current = true;
    }
  }, [map, onMapReady]);

  return null;
}

export default function CampusMap({
  children,
  className = '',
  center = CAMPUS_CENTER,
  zoom = DEFAULT_ZOOM,
  onMapReady,
}: CampusMapProps) {
  return (
    <div className={`relative w-full h-full ${className}`} role="application" aria-label="Campus map">
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full z-0 bg-gray-50 dark:bg-gray-900"
        attributionControl={false}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Re-enabled street map for outdoor context (macro-navigation) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="opacity-90"
        />

        {/* NATIVE VECTOR LAYER BLEND (Uses CSS multiply to burn the blueprint lines natively into the street layer!) */}
        <ImageOverlay
          url="/campus_floorplan.png"
          bounds={CAMPUS_BOUNDS}
          className="mix-blend-multiply opacity-80 z-20 pointer-events-none"
        />

        <ZoomControl position="topright" />
        <MapReadyHandler onMapReady={onMapReady} />
        {children}
      </MapContainer>
    </div>
  );
}
