'use client';

import React from 'react';

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-blue-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:text-lg focus:font-semibold focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      Skip to main content
    </a>
  );
}
