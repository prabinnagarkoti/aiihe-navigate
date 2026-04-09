import { CampusLocation } from '@/types';

/**
 * Format distance in meters to a human-readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Format time in minutes to a human-readable string
 */
export function formatTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}min`;
}

/**
 * Filter locations based on search query
 */
export function searchLocations(
  locations: CampusLocation[],
  query: string
): CampusLocation[] {
  if (!query.trim()) return locations;
  const lower = query.toLowerCase().trim();
  return locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lower) ||
      loc.description.toLowerCase().includes(lower) ||
      loc.searchTags.some((tag) => tag.toLowerCase().includes(lower)) ||
      loc.type.toLowerCase().includes(lower)
  );
}

/**
 * Get the icon name for a location type
 */
export function getLocationTypeLabel(type: CampusLocation['type']): string {
  const labels: Record<CampusLocation['type'], string> = {
    entrance: 'Entrance',
    building: 'Building',
    lecture: 'Lecture Theatre',
    amenity: 'Amenity',
    parking: 'Parking',
    facility: 'Facility',
  };
  return labels[type] || type;
}

/**
 * Get CSS class for event category badge
 */
export function getEventCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    lecture: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    workshop: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    social: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    admin: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    orientation: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

/**
 * Debounce helper
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

/**
 * Check if the current viewport is kiosk-sized (large screen)
 */
export function isKioskMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1920;
}

/**
 * Check if the current viewport is smartwatch-sized
 */
export function isSmartWatchMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 280;
}

/**
 * Trigger haptic feedback (vibration) if supported
 */
export function triggerHaptic(pattern: number | number[] = 100): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
