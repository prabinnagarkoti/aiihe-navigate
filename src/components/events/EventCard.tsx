'use client';

import React from 'react';
import { CampusEvent, CampusLocation } from '@/types';
import { getEventCategoryColor } from '@/lib/utils';
import { Clock, MapPin, Navigation2, Accessibility } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EventCardProps {
  event: CampusEvent;
  location?: CampusLocation;
  onNavigate?: (locationId: string) => void;
}

export default function EventCard({ event, location, onNavigate }: EventCardProps) {
  return (
    <article
      className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
      aria-label={`Event: ${event.title}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getEventCategoryColor(
                event.category
              )}`}
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
            {!event.isAccessible && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                ⚠ Limited Access
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
            {event.title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {event.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-blue-500" aria-hidden="true" />
          <time>{event.startTime} – {event.endTime}</time>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-emerald-500" aria-hidden="true" />
          <span>{location?.name || event.locationId}</span>
        </div>
        {event.isAccessible && (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Accessibility size={14} aria-hidden="true" />
            <span>Accessible</span>
          </div>
        )}
      </div>

      {onNavigate && (
        <Button
          variant="primary"
          size="sm"
          fullWidth
          icon={<Navigation2 size={16} />}
          onClick={() => onNavigate(event.locationId)}
          aria-label={`Navigate to ${location?.name || event.locationId} for ${event.title}`}
        >
          Navigate to Location
        </Button>
      )}
    </article>
  );
}
