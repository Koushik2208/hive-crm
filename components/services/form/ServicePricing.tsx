'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/ui/FormInput';
import { IndianRupee } from 'lucide-react';

export function ServicePricing() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const duration = watch('duration_mins') || 0;

  const DURATION_PRESETS = [30, 45, 60, 90];

  return (
    <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-ambient border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-6 bg-secondary rounded-full" />
        <h3 className="text-xl font-bold text-primary tracking-tight">Pricing & Duration</h3>
      </div>

      <div className="space-y-10">
        {/* Localized Price Field */}
        <div className="relative group">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Price (₹)</label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 pl-1">
              <IndianRupee size={22} strokeWidth={3} />
            </div>
            <FormInput
              name="price"
              type="number"
              step="1"
              placeholder="0.00"
              className="pl-8 bg-transparent! rounded-none focus:border-secondary transition-all font-mono text-2xl font-light py-2"
            />
          </div>
        </div>

        {/* Duration Contextual Selector */}
        <div className="space-y-4">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">Duration (Minutes)</label>
          <div className="flex flex-wrap gap-2">
            {DURATION_PRESETS.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setValue('duration_mins', preset, { shouldDirty: true, shouldValidate: true })}
                className={`
                  px-5 py-2 rounded-full text-xs font-bold border transition-all
                  ${duration === preset
                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:bg-surface-container-high'}
                `}
              >
                {preset}
              </button>
            ))}
            <div className="w-20">
              <FormInput
                name="duration_mins"
                type="number"
                placeholder="Custom"
                className="text-center bg-surface-container-low rounded-full!"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <FormInput
            name="buffer_mins"
            label="Buffer Time (Post-Service)"
            type="number"
            className="font-bold"
          />
          <span className="absolute right-4 bottom-3 text-xs text-on-surface-variant/40 font-medium">min</span>
        </div>
      </div>
    </div>
  );
}
