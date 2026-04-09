'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeMode } from '@/types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const saved = localStorage.getItem('aiihe-theme') as ThemeMode | null;
    if (saved) {
      setThemeState(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);

    if (theme === 'dark' || theme === 'high-contrast') {
      root.classList.add('dark');
    }

    localStorage.setItem('aiihe-theme', theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
