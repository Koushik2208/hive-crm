"use client";

import React from 'react';
import { StickyNote } from 'lucide-react';
import { FormTextArea } from '@/components/ui/FormTextArea';

export function ClientNotes() {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <StickyNote className="text-secondary" size={22} />
        <h3 className="text-lg font-bold text-primary tracking-tight">General History</h3>
      </div>
      
      <FormTextArea 
        name="notes" 
        label="Background & History"
        placeholder="Any additional context about the client's relationship with HiveCRM..."
        rows={6}
      />
    </section>
  );
}
