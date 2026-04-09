'use client';

import React, { useState, useEffect } from 'react';
import { MonitorPlay } from 'lucide-react';

interface KioskLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function KioskLayout({ children, sidebar }: KioskLayoutProps) {
  const [isKiosk, setIsKiosk] = useState(false);
  const [forceKiosk, setForceKiosk] = useState(false);

  useEffect(() => {
    const check = () => setIsKiosk(window.innerWidth >= 1920);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activeKiosk = isKiosk || forceKiosk;

  return (
    <>
      {!activeKiosk ? (
        <>
          {children}
          {/* Floating demo button visible only on non-kiosk screens */}
          <button 
            onClick={() => setForceKiosk(true)}
            className="fixed bottom-24 md:bottom-6 left-4 z-[999] bg-black/80 backdrop-blur-md text-white p-2 rounded-xl shadow-2xl flex items-center gap-2 hover:bg-black transition-colors border border-white/20 text-xs font-bold"
          >
            <MonitorPlay size={16} /> Demo Kiosk
          </button>
        </>
      ) : (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
          {/* Kiosk Sidebar */}
          <div className="w-80 flex-shrink-0">{sidebar}</div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto relative" id="main-content">
            <div className="p-8 pb-32 h-full">{children}</div>
            
            {forceKiosk && (
              <button 
                onClick={() => setForceKiosk(false)}
                className="absolute top-4 right-4 z-[999] bg-white text-red-600 px-4 py-2 rounded-full shadow-lg font-bold border border-red-100"
              >
                Exit Kiosk Demo
              </button>
            )}
          </main>
        </div>
      )}
    </>
  );
}
