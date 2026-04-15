import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ServicesHeader() {
  return (
    <header className="flex justify-between items-end">
      <div>
        <p className="text-[0.65rem] font-bold tracking-[0.15em] text-secondary uppercase mb-1">
          Salon Menu & Services
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">Services</h1>
      </div>
      <Button
        className="px-8 py-3.5 bg-linear-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
      >
        <Plus size={20} />
        Add Service
      </Button>
    </header>
  );
}
