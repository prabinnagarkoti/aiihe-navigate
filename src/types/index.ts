export interface CampusLocation {
  id: string;
  name: string;
  type: 'entrance' | 'building' | 'lecture' | 'amenity' | 'parking' | 'facility';
  description: string;
  lat: number;
  lng: number;
  floor?: number;
  accessible: boolean;
  accessibilityNotes?: string;
  icon: string;
  searchTags: string[];
}

export interface CampusPath {
  id: string;
  from: string;
  to: string;
  distance: number; // meters
  type: 'path' | 'ramp' | 'stairs' | 'elevator' | 'corridor';
  accessible: boolean;
  indoor: boolean;
  description?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  locationId: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'lecture' | 'workshop' | 'social' | 'sports' | 'admin' | 'orientation';
  isAccessible: boolean;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  fromLocation: CampusLocation;
  toLocation: CampusLocation;
  pathType: CampusPath['type'];
  accessible: boolean;
}

export interface Route {
  steps: RouteStep[];
  totalDistance: number;
  estimatedTime: number; // minutes
  isFullyAccessible: boolean;
  path: CampusLocation[];
}

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  timestamp: number;
}

export interface AccessibilityPreferences {
  wheelchairMode: boolean;
  highContrast: boolean;
  voiceGuidance: boolean;
  textSizeMultiplier: number;
  reducedMotion: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface NavigationState {
  isNavigating: boolean;
  currentRoute: Route | null;
  currentStepIndex: number;
  origin: CampusLocation | null;
  destination: CampusLocation | null;
  userPosition: UserPosition | null;
}
