'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GripHorizontal, X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY - dragY;
  }, [dragY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const newY = Math.max(0, e.touches[0].clientY - startY.current);
    setDragY(newY);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (dragY > 150) {
      onClose();
      setDragY(0);
    } else {
      setDragY(0);
    }
  }, [dragY, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
    }
  }, [isOpen]);

  // Trap focus within sheet
  useEffect(() => {
    if (isOpen) {
      const sheet = sheetRef.current;
      if (sheet) {
        const focusable = sheet.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusable?.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Bottom sheet'}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden transition-transform ${
          isDragging ? '' : 'duration-300'
        }`}
        style={{ transform: `translateY(${dragY}px)` }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Drag to close"
        >
          <GripHorizontal className="text-gray-300 dark:text-gray-600" size={28} />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Close"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </>
  );
}
