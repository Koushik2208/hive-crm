'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Clock } from 'lucide-react';

export function ServiceSummary() {
  const { watch } = useFormContext();
  const duration = watch('duration_mins') || 0;
  const buffer = watch('buffer_mins') || 0;
  
  const totalTime = Number(duration) + Number(buffer);

  return (
    <div className="bg-primary p-12 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 transition-all transform hover:scale-[1.02]">
      <div className="flex items-center gap-2 opacity-60 mb-6">
        <Clock size={16} strokeWidth={3} />
        <p className="text-[10px] uppercase font-black tracking-widest">Total Booking Time</p>
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-6xl font-black tracking-tighter">{totalTime}</span>
        <span className="text-lg font-medium opacity-60">minutes</span>
      </div>
      
      <p className="text-xs opacity-70 leading-relaxed font-medium">
        Incl. {duration}m active duration and {buffer}m cleaning/setup buffer.
      </p>
    </div>
  );
}
