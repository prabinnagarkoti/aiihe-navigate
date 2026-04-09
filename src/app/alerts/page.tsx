'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { BellRing, ShieldAlert, Construction, Info } from 'lucide-react';

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      type: 'danger',
      title: 'Elevator Maintenance (Building A)',
      message: 'The main elevator in Building A is out of service. Please use the secondary service elevator near the rear exit if you require step-free access.',
      time: '1 hour ago',
      icon: Construction,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Fire Drill Scheduled',
      message: 'A campus wide fire drill will commence at 2:00 PM today. Follow the digital routing signs to your nearest designated assembly point.',
      time: '3 hours ago',
      icon: ShieldAlert,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Navigation Overlay Live!',
      message: 'AIIHE Navigate has been upgraded with rigorous interior map floor plans to guide you better inside buildings.',
      time: '1 day ago',
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <BellRing className="text-gray-900 dark:text-white" size={32} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campus Alerts</h1>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={`border ${alert.bg} shadow-md`}>
            <div className="flex items-start gap-4">
              <div className={`mt-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm ${alert.color}`}>
                <alert.icon size={24} />
              </div>
              <div>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">{alert.title}</h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{alert.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-snug">
                  {alert.message}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <p className="text-center text-sm text-gray-400 mt-8">
        You are up to date with all campus notifications.
      </p>
    </div>
  );
}
