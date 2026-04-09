'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show iOS prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Android/Chrome: listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-2xl shadow-2xl p-4 z-[999] animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3 relative">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl flex-shrink-0">
          <Download className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">
            Install App
          </h3>
          {isIOS ? (
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Install this app on your iPhone or iPad: tap <span className="font-bold">Share</span> at the bottom of Safari and select <span className="font-bold">Add to Home Screen</span>.
            </p>
          ) : (
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Install BGGS Navigate for offline use and quick access.
            </p>
          )}

          {!isIOS && deferredPrompt && (
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth 
              onClick={handleInstallClick}
            >
              Install Now
            </Button>
          )}
        </div>

        <button 
          onClick={handleClose}
          className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full"
          aria-label="Dismiss install prompt"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
