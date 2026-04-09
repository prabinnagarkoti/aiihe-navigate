'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { CampusLocation } from '@/types';
import campusLocations from '@/data/campus-locations.json';
import SearchBar from '@/components/ui/SearchBar';
import Card from '@/components/ui/Card';
import { MapPin, Navigation2 } from 'lucide-react';
import { getLocationTypeLabel } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function SearchPage() {
  const router = useRouter();
  const { setDestination } = useNavigation();
  const [locations, setLocations] = useState<CampusLocation[]>([]);

  useEffect(() => {
    setLocations(campusLocations as CampusLocation[]);
  }, []);

  const handleSelect = (loc: CampusLocation) => {
    setDestination(loc);
    router.push('/route-planner');
  };

  // Group locations by type for the directory view
  const groupedLocations = locations.reduce((acc, loc) => {
    if (!acc[loc.type]) acc[loc.type] = [];
    acc[loc.type].push(loc);
    return acc;
  }, {} as Record<string, CampusLocation[]>);

  const categories = Object.keys(groupedLocations).sort();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Directory</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find buildings, lecture theatres, and campus amenities.
        </p>
      </div>

      <SearchBar 
        locations={locations} 
        onSelect={handleSelect} 
        placeholder="Type to search..."
        className="mb-8"
      />

      <div className="space-y-8">
        {categories.map(category => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2 
              id={`cat-${category}`} 
              className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2"
            >
              {getLocationTypeLabel(category as any)}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedLocations[category].map(loc => (
                <Card 
                  key={loc.id} 
                  hoverable
                  onClick={() => handleSelect(loc)}
                  ariaLabel={`Navigate to ${loc.name}`}
                  className="flex flex-col h-full"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{loc.name}</h3>
                      {loc.accessible ? (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex-shrink-0" aria-label="Accessible">
                          ♿
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex-shrink-0" aria-label="Limited access">
                          ⚠
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {loc.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin size={14} />
                    <span>Floor {loc.floor ?? 0}</span>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    icon={<Navigation2 size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(loc);
                    }}
                  >
                    Directions
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
