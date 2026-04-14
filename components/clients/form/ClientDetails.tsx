"use client";

import React from 'react';
import { Fingerprint, Tag, Calendar } from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';

export function ClientDetails() {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Fingerprint className="text-secondary" size={22} />
        <h3 className="text-lg font-bold text-primary tracking-tight">Profile Details</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FormInput 
          name="dob" 
          label="Date of Birth" 
          type="date"
          placeholder="YYYY-MM-DD"
        />
        <FormSelect 
          name="gender" 
          label="Gender" 
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
          ]}
        />
        <div className="space-y-2">
          <FormInput 
            name="tags" 
            label="Tags" 
            placeholder="e.g. VIP, Regular" 
            helperText="Separate tags with commas"
          />
        </div>
      </div>
    </section>
  );
}
