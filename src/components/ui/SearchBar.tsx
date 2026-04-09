'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { CampusLocation } from '@/types';

interface SearchBarProps {
  locations: CampusLocation[];
  onSelect: (location: CampusLocation) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  locations,
  onSelect,
  placeholder = 'Search buildings, classrooms, events...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.trim()
    ? locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.searchTags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          loc.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleSelect = (loc: CampusLocation) => {
    onSelect(loc);
    setQuery(loc.name);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          size={20}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen && filtered.length > 0}
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
          aria-label="Search campus locations"
          aria-autocomplete="list"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-base shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <ul
          id="search-results"
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
        >
          {filtered.map((loc, idx) => (
            <li
              key={loc.id}
              id={`search-item-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              onClick={() => handleSelect(loc)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                idx === activeIndex
                  ? 'bg-blue-50 dark:bg-blue-900/40'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${idx === 0 ? 'rounded-t-2xl' : ''} ${
                idx === filtered.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {loc.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {loc.description}
                </p>
              </div>
              {loc.accessible ? (
                <span className="flex-shrink-0 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded-full" aria-label="Accessible">
                  ♿ Accessible
                </span>
              ) : (
                <span className="flex-shrink-0 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 px-2 py-1 rounded-full" aria-label="Limited accessibility">
                  ⚠ Limited
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.trim() && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 text-center text-gray-500 dark:text-gray-400">
          No locations found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
