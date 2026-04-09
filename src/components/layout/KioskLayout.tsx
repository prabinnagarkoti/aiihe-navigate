'use client';

import React, { useState, useEffect } from 'react';

interface KioskLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function KioskLayout({ children, sidebar }: KioskLayoutProps) {
  const [isKiosk, setIsKiosk] = useState(false);

  useEffect(() => {
    const check = () => setIsKiosk(window.innerWidth >= 1920);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isKiosk) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Kiosk Sidebar */}
      <div className="w-80 flex-shrink-0">{sidebar}</div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
