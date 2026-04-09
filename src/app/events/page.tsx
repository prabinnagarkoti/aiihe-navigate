'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import EventFeed from '@/components/events/EventFeed';
import { CampusLocation, CampusEvent } from '@/types';
import campusLocations from '@/data/campus-locations.json';
import campusEvents from '@/data/campus-events.json';

export default function EventsPage() {
  const router = useRouter();
  const { setDestination } = useNavigation();
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    setLocations(campusLocations as CampusLocation[]);
    setEvents(campusEvents as CampusEvent[]);
  }, []);

  const handleNavigate = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    if (loc) {
      setDestination(loc);
      router.push('/route-planner');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Campus Events</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover what's happening around AIIHE today.
        </p>
      </div>

      <EventFeed 
        events={events} 
        locations={locations} 
        onNavigate={handleNavigate} 
      />
    </div>
  );
}
