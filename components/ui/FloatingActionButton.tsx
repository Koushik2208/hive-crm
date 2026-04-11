import React from 'react';
import { Plus } from 'lucide-react';

export default function FloatingActionButton() {
  return (
    <button className="fixed bottom-10 right-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-ambient hover:scale-105 active:scale-95 transition-all duration-250 z-50 bg-primary-gradient">
      <Plus size={32} />
    </button>
  );
}
