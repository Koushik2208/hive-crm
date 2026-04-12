"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

/**
 * A reusable "Aura Velvet" Drawer component.
 * Features glassmorphism background, smooth transitions, and thematic typography.
 */
export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'w-[440px]'
}: DrawerProps) {
  // Handle ESC key and Body scroll lock
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-primary/20 backdrop-blur-[2px] z-100 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 h-full ${width} bg-surface-bright/95 backdrop-blur-2xl z-101 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-outline-variant/10 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-primary">{title}</h2>
            {subtitle && (
              <div className="mt-1">
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-outline-variant">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-8 border-t border-outline-variant/10 bg-surface-bright/50">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
