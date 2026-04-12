"use client";

import React, { forwardRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

/**
 * Presentational TextArea component with "Aura Velvet" tonal container styling.
 * Supports labels, errors, and standard textarea properties.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ 
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
      
      <textarea
        id={inputId}
        ref={ref}
        {...props}
        className={`
          w-full bg-surface-container-low border-0 
          ${error ? 'ring-1 ring-error' : 'focus:ring-2 focus:ring-secondary/20'}
          rounded-2xl px-4 py-3.5 text-sm text-primary 
          placeholder:text-outline-variant/60 transition-all duration-200 
          outline-none resize-none
        `}
      />

      {error ? (
        <p className="text-[10px] text-error mt-1 ml-1 font-medium italic animate-in fade-in duration-200">
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

TextArea.displayName = 'TextArea';
