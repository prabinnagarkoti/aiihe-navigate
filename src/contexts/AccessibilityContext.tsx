'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AccessibilityPreferences } from '@/types';

interface AccessibilityContextType extends AccessibilityPreferences {
  setWheelchairMode: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setVoiceGuidance: (v: boolean) => void;
  setTextSizeMultiplier: (v: number) => void;
  setReducedMotion: (v: boolean) => void;
}

const defaultPrefs: AccessibilityPreferences = {
  wheelchairMode: false,
  highContrast: false,
  voiceGuidance: false,
  textSizeMultiplier: 1,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(defaultPrefs);

  useEffect(() => {
    const saved = localStorage.getItem('aiihe-accessibility');
    if (saved) {
      try {
        setPrefs({ ...defaultPrefs, ...JSON.parse(saved) });
      } catch {
        // ignore invalid data
      }
    }
    // Check system preference for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefs((p) => ({ ...p, reducedMotion: true }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aiihe-accessibility', JSON.stringify(prefs));

    // Apply text size to root
    document.documentElement.style.fontSize = `${prefs.textSizeMultiplier * 100}%`;

    // Apply high contrast class
    if (prefs.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Reduced motion
    if (prefs.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [prefs]);

  const setWheelchairMode = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, wheelchairMode: v }));
  }, []);

  const setHighContrast = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, highContrast: v }));
  }, []);

  const setVoiceGuidance = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, voiceGuidance: v }));
  }, []);

  const setTextSizeMultiplier = useCallback((v: number) => {
    setPrefs((p) => ({ ...p, textSizeMultiplier: Math.min(2, Math.max(1, v)) }));
  }, []);

  const setReducedMotion = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, reducedMotion: v }));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        ...prefs,
        setWheelchairMode,
        setHighContrast,
        setVoiceGuidance,
        setTextSizeMultiplier,
        setReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
