"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  className?: string;
}

/**
 * A specialized "Aura Velvet" filter dropdown component.
 * Features a label prefix and custom interactive overlay.
 * Ideal for dashboard filter bars and non-form selection needs.
 */
export function FilterDropdown({ 
  label, 
  value, 
  options, 
  onSelect,
  className = ''
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center bg-white px-4 py-2 rounded-xl border 
          ${isOpen ? 'border-secondary/30 ring-2 ring-secondary/5' : 'border-outline-variant/10'}
          cursor-pointer hover:bg-surface-bright transition-all shadow-sm
        `}
      >
        <span className="text-xs font-semibold text-on-surface-variant/60 mr-2">{label}:</span>
        <span className="text-sm font-medium text-primary">{value}</span>
        <ChevronDown 
          size={14} 
          className={`ml-2 text-on-surface-variant/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-ambient border border-outline-variant/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-5 py-3 text-sm transition-colors
                  ${value === opt 
                    ? 'text-secondary bg-secondary/5 font-semibold' 
                    : 'text-primary hover:bg-surface-container-low'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
