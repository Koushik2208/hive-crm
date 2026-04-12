"use client";

import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
  placeholderText?: string;
  helperText?: string;
  className?: string;
}

/**
 * Presentational Select component with "Aura Velvet" tonal container styling.
 * Uses a native HTML select element with a custom chevron icon.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ 
  label, 
  error, 
  options,
  placeholderText,
  helperText, 
  className = '', 
  id,
  ...props 
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className={`relative group w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={inputId}
          ref={ref}
          {...props}
          className={`
            w-full bg-surface-container-low border-0 
            ${error ? 'ring-1 ring-error' : 'focus:ring-2 focus:ring-secondary/20'}
            rounded-xl px-4 py-3 text-sm text-primary appearance-none
            transition-all duration-200 outline-none
          `}
        >
          <option value="" disabled>{placeholderText || 'Select option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant opacity-40">
          <ChevronDown size={16} />
        </div>
      </div>

      {error ? (
        <p className="text-[10px] text-error mt-1 ml-1 font-medium animate-in fade-in duration-200">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[10px] text-on-surface-variant/60 mt-1 ml-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
