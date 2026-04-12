"use client";

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

/**
 * Presentational Input component with "Aura Velvet" bottom-border styling.
 * Supports labels, errors, and standard input properties.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
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
      
      <input
        id={inputId}
        ref={ref}
        {...props}
        className={`
          w-full bg-transparent border-b 
          ${error ? 'border-error' : 'border-outline-variant/30'}
          focus:border-secondary focus:ring-0 px-1 py-1.5 
          text-primary placeholder:text-outline-variant/60 
          transition-all duration-200 outline-none
        `}
      />

      {error ? (
        <p className="text-[10px] text-error mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
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

Input.displayName = 'Input';
