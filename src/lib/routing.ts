import { CampusLocation, CampusPath, Route, RouteStep } from '@/types';

interface GraphNode {
  locationId: string;
  distance: number;
  previous: string | null;
}

/**
 * Dijkstra's algorithm with accessibility-aware edge weighting.
 * When accessibleOnly is true, stairs are given infinite weight (excluded),
 * and ramps/elevators get a slight bonus (lower weight).
 */
export function calculateRoute(
  locations: CampusLocation[],
  paths: CampusPath[],
  startId: string,
  endId: string,
  accessibleOnly: boolean = true
): Route | null {
  const locationMap = new Map<string, CampusLocation>();
  locations.forEach((loc) => locationMap.set(loc.id, loc));

  // Build adjacency list
  const adjacency = new Map<string, { neighborId: string; path: CampusPath }[]>();
  locations.forEach((loc) => adjacency.set(loc.id, []));

  paths.forEach((path) => {
    // Bidirectional edges
    if (adjacency.has(path.from) && adjacency.has(path.to)) {
      adjacency.get(path.from)!.push({ neighborId: path.to, path });
      adjacency.get(path.to)!.push({ neighborId: path.from, path });
    }
  });

  // Dijkstra's
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const prevPath = new Map<string, CampusPath | null>();
  const visited = new Set<string>();

  locations.forEach((loc) => {
    dist.set(loc.id, Infinity);
    prev.set(loc.id, null);
    prevPath.set(loc.id, null);
  });
  dist.set(startId, 0);

  while (true) {
    // Find unvisited node with min distance
    let minDist = Infinity;
    let current: string | null = null;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < minDist) {
        minDist = d;
        current = id;
      }
    }

    if (current === null || current === endId) break;
    visited.add(current);

    const neighbors = adjacency.get(current) || [];
    for (const { neighborId, path } of neighbors) {
      if (visited.has(neighborId)) continue;

      // Calculate edge weight
      let weight = path.distance;

      if (accessibleOnly) {
        if (!path.accessible || path.type === 'stairs') {
          weight = Infinity; // Block inaccessible paths
          continue;
        }
        // Prefer ramps and elevators
        if (path.type === 'ramp') weight *= 0.9;
        if (path.type === 'elevator') weight *= 0.85;
      }

      const newDist = dist.get(current)! + weight;
      if (newDist < dist.get(neighborId)!) {
        dist.set(neighborId, newDist);
        prev.set(neighborId, current);
        prevPath.set(neighborId, path);
      }
    }
  }

  // Reconstruct path
  if (dist.get(endId) === Infinity) return null;

  const pathLocations: CampusLocation[] = [];
  const pathEdges: CampusPath[] = [];
  let current: string | null = endId;

  while (current !== null) {
    const loc = locationMap.get(current);
    if (loc) pathLocations.unshift(loc);
    const edge = prevPath.get(current);
    if (edge) pathEdges.unshift(edge);
    current = prev.get(current) || null;
  }

  // Build steps
  const steps: RouteStep[] = [];
  for (let i = 0; i < pathLocations.length - 1; i++) {
    const edge = pathEdges[i];
    steps.push({
      instruction: generateInstruction(pathLocations[i], pathLocations[i + 1], edge),
      distance: edge.distance,
      fromLocation: pathLocations[i],
      toLocation: pathLocations[i + 1],
      pathType: edge.type,
      accessible: edge.accessible,
    });
  }

  const totalDistance = steps.reduce((sum, s) => sum + s.distance, 0);
  const estimatedTime = Math.ceil(totalDistance / 70); // ~70m/min walking, ~50m/min wheelchair
  const isFullyAccessible = steps.every((s) => s.accessible);

  return {
    steps,
    totalDistance,
    estimatedTime: accessibleOnly ? Math.ceil(totalDistance / 50) : estimatedTime,
    isFullyAccessible,
    path: pathLocations,
  };
}

function generateInstruction(
  from: CampusLocation,
  to: CampusLocation,
  path: CampusPath
): string {
  const typeDescriptions: Record<CampusPath['type'], string> = {
    path: 'Walk along the pathway',
    ramp: 'Take the ramp',
    stairs: 'Go up/down the stairs',
    elevator: 'Take the elevator',
    corridor: 'Walk through the corridor',
  };

  const action = typeDescriptions[path.type] || 'Continue';
  return `${action} from ${from.name} to ${to.name} (${path.distance}m)`;
}

/**
 * Haversine formula to calculate distance between two lat/lng points
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest campus location to a given coordinate
 */
export function findNearestLocation(
  lat: number,
  lng: number,
  locations: CampusLocation[]
): CampusLocation | null {
  let nearest: CampusLocation | null = null;
  let minDist = Infinity;

  for (const loc of locations) {
    const d = haversineDistance(lat, lng, loc.lat, loc.lng);
    if (d < minDist) {
      minDist = d;
      nearest = loc;
    }
  }

  return nearest;
}
