'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Map,
  Route,
  Calendar,
  Search,
  Navigation,
  Accessibility,
  Watch,
  Info,
} from 'lucide-react';

const sidebarItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/navigate', label: 'Live Map', icon: Map },
  { href: '/route-planner', label: 'Route Planner', icon: Route },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/smartwatch', label: 'Watch View', icon: Watch },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden kiosk:flex lg:flex flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full"
      aria-label="Sidebar navigation"
    >
      {/* Logo area */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Navigation size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              AIIHE Navigate
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Smart Campus Navigation
            </p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-h-[48px] ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
          <Accessibility size={16} aria-hidden="true" />
          <span>Inclusive Navigation</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 dark:text-gray-500">
          <Info size={14} aria-hidden="true" />
          <span>AIIHE Brisbane, QLD</span>
        </div>
      </div>
    </aside>
  );
}
