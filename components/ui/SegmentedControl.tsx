"use client";

import React from 'react';

export interface SegmentedControlProps {
  options: string[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ 
  options, 
  activeValue, 
  onChange, 
  className = '' 
}: SegmentedControlProps) {
  return (
    <div className={`bg-surface-container-low p-1 rounded-full flex ${className}`}>
      {options.map((option) => {
        const isActive = activeValue === option;
        
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-surface text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
