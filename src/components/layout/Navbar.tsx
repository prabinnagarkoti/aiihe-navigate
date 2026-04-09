'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import HighContrastToggle from '@/components/accessibility/HighContrastToggle';
import TextSizeControl from '@/components/accessibility/TextSizeControl';
import Toggle from '@/components/ui/Toggle';
import {
  Navigation,
  Sun,
  Moon,
  Settings,
  X,
  Accessibility,
  Volume2,
} from 'lucide-react';

export default function Navbar() {
  const { theme, toggleDarkMode } = useTheme();
  const {
    wheelchairMode,
    setWheelchairMode,
    voiceGuidance,
    setVoiceGuidance,
  } = useAccessibility();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 high-contrast:bg-black high-contrast:border-yellow-400">
      <nav
        className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg px-1"
          aria-label="AIIHE Navigate - Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Navigation size={20} className="text-white" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
              AIIHE
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg ml-1">
              Navigate
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Home' },
            { href: '/navigate', label: 'Map' },
            { href: '/route-planner', label: 'Route Planner' },
            { href: '/events', label: 'Events' },
            { href: '/search', label: 'Search' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {theme === 'dark' || theme === 'high-contrast' ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>

          {/* Accessibility settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Accessibility settings"
            aria-expanded={showSettings}
            className={`p-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-w-[44px] min-h-[44px] flex items-center justify-center ${
              showSettings
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Accessibility size={20} />
          </button>
        </div>
      </nav>

      {/* Settings panel */}
      {showSettings && (
        <div
          className="absolute right-4 top-16 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-5 z-50"
          role="dialog"
          aria-label="Accessibility settings"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings size={18} aria-hidden="true" />
              Accessibility
            </h2>
            <button
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <Toggle
              id="wheelchair-mode"
              checked={wheelchairMode}
              onChange={setWheelchairMode}
              label="♿ Wheelchair Mode"
              description="Avoid stairs, prefer ramps & elevators"
            />

            <Toggle
              id="voice-guidance"
              checked={voiceGuidance}
              onChange={setVoiceGuidance}
              label="🔊 Voice Guidance"
              description="Speak turn-by-turn directions"
            />

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                High Contrast
              </p>
              <HighContrastToggle />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Size
              </p>
              <TextSizeControl />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
