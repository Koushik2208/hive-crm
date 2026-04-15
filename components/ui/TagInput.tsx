"use client";

import React, { useState, KeyboardEvent, useRef } from 'react';
import { X } from 'lucide-react';

export interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

/**
 * A thematic "Aura Velvet" multi-tag input component.
 * Converts typed text into pills on Enter or Comma.
 */
export function TagInput({
  label,
  value = [],
  onChange,
  placeholder,
  error,
  helperText,
  className = '',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div className={`relative group w-full ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">
          {label}
        </label>
      )}

      <div 
        className={`
          min-h-[44px] w-full bg-transparent border-b 
          ${error ? 'border-error' : 'border-outline-variant/30 group-focus-within:border-secondary'}
          transition-all duration-200 py-1.5 flex flex-wrap gap-2 items-center
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span 
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1.5 bg-surface-container-high text-primary px-2.5 py-1 rounded-full text-xs font-medium animate-in zoom-in-95 duration-200"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="text-on-surface-variant/40 hover:text-error transition-colors p-0.5"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none outline-none text-sm text-primary placeholder:text-outline-variant/60 min-w-[120px]"
        />
      </div>

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
}
