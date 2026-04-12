"use client";

import React from 'react';
import { Scissors, Palette } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { FormInput } from '@/components/ui/FormInput';

const COLOR_PALETTE = [
  '#32172a', // Primary
  '#6c538b', // Secondary
  '#d6c4a5', // Tertiary Fixed Dim
  '#8e6e5a', // Earthy
  '#5a8e7b', // Sage
  '#ac9c7f', // Muted Gold
];

export function ProfessionalSection() {
  const { watch, setValue } = useFormContext();
  const selectedColor = watch('colorHex');

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Scissors className="text-secondary" size={22} />
        <h3 className="text-lg font-bold text-primary tracking-tight">Professional Details</h3>
      </div>
      
      <div className="space-y-10">
        <FormTextArea 
          name="bio" 
          label="Professional Bio" 
          placeholder="Describe the staff's expertise, specialties, and professional background..." 
          className="min-h-[140px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative">
            <FormInput 
              name="commissionRate" 
              label="Commission Rate (%)" 
              type="number"
              placeholder="15"
              step="0.5"
              className="font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Staff Theme Color
            </label>
            <div className="flex items-center gap-4 bg-surface-container-low px-4 py-3.5 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-3">
                {COLOR_PALETTE.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('colorHex', color)}
                    className={`
                      w-7 h-7 rounded-full transition-all 
                      ${selectedColor === color 
                        ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-lg' 
                        : 'hover:scale-110 opacity-70 hover:opacity-100'}
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="ml-auto flex items-center gap-3 border-l border-outline-variant/20 pl-4">
                <div 
                  className="w-7 h-7 rounded-lg border border-outline-variant/30 shadow-inner"
                  style={{ backgroundColor: selectedColor }}
                />
                <Palette size={18} className="text-on-surface-variant/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
