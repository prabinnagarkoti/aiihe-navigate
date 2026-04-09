'use client';

import React from 'react';
import { CampusEvent, CampusLocation } from '@/types';
import EventCard from './EventCard';
import { Calendar } from 'lucide-react';

interface EventFeedProps {
  events: CampusEvent[];
  locations: CampusLocation[];
  onNavigate?: (locationId: string) => void;
}

export default function EventFeed({ events, locations, onNavigate }: EventFeedProps) {
  const locationMap = new Map(locations.map((l) => [l.id, l]));

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar size={48} className="text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          No Events Today
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Check back tomorrow for upcoming campus events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="feed" aria-label="Today's campus events">
      {sortedEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          location={locationMap.get(event.locationId)}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
