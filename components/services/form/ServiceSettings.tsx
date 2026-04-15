'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

export function ServiceSettings() {
  const { watch, setValue } = useFormContext();
  const isActive = watch('is_active');
  const isMultiStaff = watch('is_multi_staff');

  return (
    <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-ambient border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-6 bg-secondary rounded-full" />
        <h3 className="text-xl font-bold text-primary tracking-tight">Service Settings</h3>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between group">
          <div>
            <p className="text-sm font-bold text-primary">Active Service</p>
            <p className="text-[10px] text-on-surface-variant/60 font-medium">Visible for online booking</p>
          </div>
          <button 
            type="button"
            onClick={() => setValue('is_active', !isActive, { shouldDirty: true })}
            className={`
              w-11 h-6 rounded-full transition-all duration-300 relative
              ${isActive ? 'bg-primary shadow-lg' : 'bg-outline-variant/30'}
            `}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isActive ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between group">
          <div>
            <p className="text-sm font-bold text-primary">Multi-staff capability</p>
            <p className="text-[10px] text-on-surface-variant/60 font-medium">Can be booked with multiple providers</p>
          </div>
          <button 
            type="button"
            onClick={() => setValue('is_multi_staff', !isMultiStaff, { shouldDirty: true })}
            className={`
              w-11 h-6 rounded-full transition-all duration-300 relative
              ${isMultiStaff ? 'bg-primary shadow-lg' : 'bg-outline-variant/30'}
            `}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isMultiStaff ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
