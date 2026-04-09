'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation2, Map as MapIcon, Calendar, Search as SearchIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import EventCard from '@/components/events/EventCard';
import campusLocations from '@/data/campus-locations.json';
import campusEvents from '@/data/campus-events.json';
import { CampusLocation, CampusEvent } from '@/types';
import { useNavigation } from '@/contexts/NavigationContext';

export default function HomePage() {
  const router = useRouter();
  const { setDestination } = useNavigation();
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    setLocations(campusLocations as CampusLocation[]);
    setEvents(campusEvents.slice(0, 3) as CampusEvent[]); // Just show next 3
  }, []);

  const handleSearchSelect = (loc: CampusLocation) => {
    setDestination(loc);
    router.push('/route-planner');
  };

  const handleEventNavigate = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    if (loc) {
      setDestination(loc);
      router.push('/route-planner');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white rounded-b-[2.5rem] pt-12 pb-16 px-6 shadow-2xl relative overflow-hidden"
        aria-labelledby="hero-title"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 id="hero-title" className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Navigate BGGS.
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-lg">
            Inclusive wayfinding for the Junior School Campus at Spring Hill.
          </p>
          
          <div className="mb-6 relative z-20">
            <SearchBar 
              locations={locations} 
              onSelect={handleSearchSelect} 
              placeholder="Find Year Level hubs, cars parks, or facilities..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              variant="primary" 
              size="lg" 
              icon={<Navigation2 size={20} />}
              onClick={() => router.push('/navigate')}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 font-bold"
            >
              Start Live Navigation
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              icon={<MapIcon size={20} />}
              onClick={() => router.push('/route-planner')}
              className="border-white/30 text-white hover:bg-white/10 dark:hover:bg-white/10"
            >
              Plan a Route
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full -mt-6">
        
        {/* Quick Actions */}
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 mb-8" aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title" className="sr-only">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Campus Map', icon: MapIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/40', path: '/navigate' },
              { label: 'Route Planner', icon: Navigation2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/40', path: '/route-planner' },
              { label: 'Events Hub', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/40', path: '/events' },
              { label: 'Directory', icon: SearchIcon, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/40', path: '/search' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${action.bg}`}
              >
                <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm mb-3 ${action.color}`}>
                  <action.icon size={24} />
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Upcoming Events Preview */}
        <section aria-labelledby="events-title">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 id="events-title" className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Today</h2>
            <button 
              onClick={() => router.push('/events')}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
            >
              See all
            </button>
          </div>
          
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                location={locations.find(l => l.id === event.locationId)}
                onNavigate={handleEventNavigate}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
