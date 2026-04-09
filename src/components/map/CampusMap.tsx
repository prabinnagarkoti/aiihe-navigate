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
        {/* Removed grayscale inversion to make it look like a fully native colorful Google Map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="opacity-90"
        />

        {/* NATIVE VECTOR LAYER (Replaces the ugly white square paper overlay) */}
        
        {/* Main Campus Grounds */}
        <Polygon pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 2 }} positions={campusFootprint} />
        
        {/* Reception / Admin Hub */}
        <Rectangle bounds={[[-27.4587, 153.0243], [-27.4591, 153.0247]]} pathOptions={{ color: '#4f46e5', fillColor: '#6366f1', fillOpacity: 0.3, weight: 1 }}>
          <Tooltip direction="bottom" opacity={0.8} permanent>Reception</Tooltip>
        </Rectangle>
        
        {/* Year 5 Hub */}
        <Rectangle bounds={[[-27.4589, 153.0247], [-27.4594, 153.0251]]} pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.2, weight: 1 }}>
          <Tooltip direction="bottom" opacity={0.8} permanent>Year 5</Tooltip>
        </Rectangle>
        
        {/* Year 6 Hub */}
        <Rectangle bounds={[[-27.4583, 153.0247], [-27.4588, 153.0251]]} pathOptions={{ color: '#059669', fillColor: '#10b981', fillOpacity: 0.2, weight: 1 }}>
          <Tooltip direction="bottom" opacity={0.8} permanent>Year 6</Tooltip>
        </Rectangle>
        
        {/* Undercroft Parking */}
        <Rectangle bounds={[[-27.4583, 153.0243], [-27.4586, 153.0247]]} pathOptions={{ color: '#475569', fillColor: '#64748b', fillOpacity: 0.2, weight: 1 }}>
          <Tooltip direction="bottom" opacity={0.8} permanent>Undercroft PWD</Tooltip>
        </Rectangle>
        
        {/* Podium Planting Area */}
        <Rectangle bounds={[[-27.4587, 153.0239], [-27.4591, 153.0242]]} pathOptions={{ color: '#65a30d', fillColor: '#84cc16', fillOpacity: 0.3, weight: 1 }}>
          <Tooltip direction="bottom" opacity={0.8} permanent>Podium Greenery</Tooltip>
        </Rectangle>

        <ZoomControl position="topright" />
        <MapReadyHandler onMapReady={onMapReady} />
        {children}
      </MapContainer>
    </div>
  );
}
