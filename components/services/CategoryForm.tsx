'use client';

import React, { useState } from 'react';
import { useCreateCategory } from '@/hooks/useServices';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PREDEFINED_COLORS = [
  '#32172a', // Deep Plum (Primary)
  '#6c538b', // Muted Lavender (Secondary)
  '#f3e0c0', // Champagne (Tertiary Fixed)
  '#4a2c40', // Deep Orchid
  '#d1c3c9', // Rose Quartz
  '#9e8b7d', // Earthy Taupe
];

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const { mutate: createCategory, isLoading } = useCreateCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createCategory(
      { name, color_hex: selectedColor },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col mb-10">
        <h2 className="text-2xl font-extrabold tracking-tighter text-primary">New Category</h2>
        <p className="text-sm text-on-surface-variant/60 font-medium tracking-tight">
          Create a new service grouping for your catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Name Input */}
        <Input
          label="Category Name"
          placeholder="e.g. Skin Restoration"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        {/* Color Sector */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase font-bold tracking-[0.1em] text-primary/60 ml-1">
            Select Color Indicator
          </label>
          <div className="flex flex-wrap gap-5 ml-1">
            {PREDEFINED_COLORS.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-10 h-10 rounded-full transition-all duration-300 
                    ${isSelected 
                      ? 'ring-2 ring-primary ring-offset-4 ring-offset-surface scale-90 shadow-lg shadow-primary/20' 
                      : 'hover:scale-110 shadow-sm'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-8 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-secondary font-bold text-sm tracking-tight hover:opacity-70 transition-all active:scale-95"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="px-10 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all"
          >
            {isLoading ? 'Saving...' : 'Save Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
