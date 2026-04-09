import { UserPosition } from '@/types';

type PositionCallback = (position: UserPosition) => void;
type ErrorCallback = (error: GeolocationPositionError) => void;

let watchId: number | null = null;

/**
 * Start watching user's GPS location
 */
export function watchUserPosition(
  onUpdate: PositionCallback,
  onError?: ErrorCallback
): void {
  if (!navigator.geolocation) {
    console.warn('Geolocation is not supported by this browser.');
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      console.error('Geolocation error:', error.message);
      if (onError) onError(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );
}

/**
 * Stop watching user's GPS location
 */
export function stopWatchingPosition(): void {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

/**
 * Get current position as a one-shot request
 */
export function getCurrentPosition(): Promise<UserPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );
  });
}
