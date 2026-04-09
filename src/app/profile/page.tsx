'use client';

import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Toggle from '@/components/ui/Toggle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User, Settings, ShieldAlert, Heart } from 'lucide-react';

export default function ProfilePage() {
  const { wheelchairMode, setWheelchairMode } = useAccessibility();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-5">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      
      <div className="flex items-center gap-4 p-6 glass-panel rounded-3xl">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <User size={40} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AIIHE Student</h2>
          <p className="text-gray-500">student@aiihe.edu.au</p>
          <div className="mt-2 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-3 py-1 rounded-full w-fit font-medium">
            Verified Account
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-2 flex items-center gap-2">
          <Settings size={20} className="text-gray-400" />
          Navigation Preferences
        </h3>
        <Card className="hover-lift">
          <Toggle
            id="profile-wheelchair-mode"
            checked={wheelchairMode}
            onChange={setWheelchairMode}
            label="Wheelchair Accessibility Always On"
            description="All routes will automatically exclude stairs globally across the app."
          />
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-2 flex items-center gap-2">
          <Heart size={20} className="text-gray-400" />
          Saved Locations
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card hoverable className="text-center font-semibold">🏠 Home Config</Card>
          <Card hoverable className="text-center font-semibold">📚 Library Desk</Card>
        </div>
      </div>

      <div className="mt-8 border-t border-red-200 dark:border-red-900/30 pt-8 space-y-4">
        <Button variant="danger" fullWidth icon={<ShieldAlert size={20} />}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
