"use client";

import React from 'react';
import { FormInput } from '@/components/ui/FormInput';
import { FormTagInput } from '@/components/ui/FormTagInput';
import { FormStaffSelect } from '@/components/ui/FormStaffSelect';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function ClientClinicInfo() {
  return (
    <section className="space-y-12">
      <div className="flex items-center gap-4 mb-4">
        <ShieldCheck className="text-secondary" size={22} />
        <h3 className="text-lg font-bold text-primary tracking-tight">Clinical & Care Observations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Medical Flags Group */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4 mb-6">
            <ShieldCheck size={18} className="text-red-400" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Medical History & Flags</span>
          </div>

          <div className="space-y-6">
            <FormTagInput
              name="medicalFlags.allergies"
              label="Allergies"
              placeholder="e.g. Latex (Press Enter or comma)"
            />
            <FormTagInput
              name="medicalFlags.conditions"
              label="Medical Conditions"
              placeholder="e.g. Diabetes"
            />
            <FormTagInput
              name="medicalFlags.medications"
              label="Current Medications"
              placeholder="e.g. Aspirin"
            />
          </div>
        </div>

        {/* Beauty Notes Group */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4 mb-6">
            <Sparkles size={18} className="text-secondary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Beauty & Style Preferences</span>
          </div>

          <div className="space-y-6">
            <FormInput
              name="beautyNotes.hair_colour"
              label="Hair Colour Formula"
              placeholder="e.g. Schwarzkopf 7.44 + 6%"
            />
            <FormInput
              name="beautyNotes.last_colour_date"
              label="Last Colour Service"
              type="date"
            />
            <FormStaffSelect
              name="beautyNotes.preferred_stylist"
              label="Preferred Stylist"
              placeholder="Select a stylist"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
