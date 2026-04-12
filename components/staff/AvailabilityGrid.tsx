"use client";

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Clock, Trash2 } from 'lucide-react';
import { StaffFormValues } from '@/lib/validations/staff.schema';

const DAYS_OF_WEEK = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 0 },
];

export default function AvailabilityGrid() {
  const { control } = useFormContext<StaffFormValues>();
  const { fields, update } = useFieldArray({
    control,
    name: "availability",
  });



  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Clock className="text-secondary" size={22} />
          <h3 className="text-lg font-bold text-primary tracking-tight">Weekly Availability</h3>
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-tertiary-fixed px-3 py-1.5 rounded-full">
          Standard Shift
        </span>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const day = DAYS_OF_WEEK.find(d => d.value === field.dayOfWeek);
          return (
            <div 
              key={field.id}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-2xl transition-all duration-300 ${
                field.isAvailable 
                  ? 'bg-surface-container-low/50 hover:bg-surface-container-low border border-transparent' 
                  : 'bg-surface-container-low/20 opacity-60'
              }`}
            >
              <div className="sm:col-span-3 flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => update(index, { ...field, isAvailable: !field.isAvailable })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    field.isAvailable ? 'bg-primary' : 'bg-outline-variant/30'
                  }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    field.isAvailable ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
                <span className="text-sm font-bold text-primary w-24">{day?.label}</span>
              </div>

              {field.isAvailable ? (
                <>
                  <div className="sm:col-span-4">
                    <div className="flex items-center gap-3">
                      <input 
                        type="time" 
                        value={field.startTime}
                        onChange={(e) => update(index, { ...field, startTime: e.target.value })}
                        className="bg-surface-bright border-0 text-xs rounded-lg px-3 py-2.5 w-full text-primary shadow-sm focus:ring-2 focus:ring-secondary/20" 
                      />
                      <span className="text-on-surface-variant text-[10px] uppercase font-black opacity-30">To</span>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <input 
                      type="time" 
                      value={field.endTime}
                      onChange={(e) => update(index, { ...field, endTime: e.target.value })}
                      className="bg-surface-bright border-0 text-xs rounded-lg px-3 py-2.5 w-full text-primary shadow-sm focus:ring-2 focus:ring-secondary/20" 
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-8">
                  <p className="text-xs italic text-on-surface-variant/60 font-medium tracking-wide">
                    Scheduled Day Off
                  </p>
                </div>
              )}

              <div className="sm:col-span-1 flex justify-end">
                <button 
                  type="button"
                  className="p-2 text-on-surface-variant/20 hover:text-error transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
