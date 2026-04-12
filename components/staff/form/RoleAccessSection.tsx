"use client";

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormSelect } from '@/components/ui/FormSelect';

interface RoleAccessSectionProps {
  branches?: { id: string; name: string }[];
}

const ROLE_OPTIONS = [
  { label: 'Staff Member', value: 'staff' },
  { label: 'Branch Manager', value: 'branch_manager' },
  { label: 'Receptionist', value: 'receptionist' },
  { label: 'Tenant Owner', value: 'tenant_owner' },
];

export function RoleAccessSection({ branches = [] }: RoleAccessSectionProps) {
  const { watch, setValue } = useFormContext();
  const isActive = watch('isActive');

  const branchOptions = branches.map(b => ({
    label: b.name,
    value: b.id
  }));

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck className="text-secondary" size={22} />
        <h3 className="text-lg font-bold text-primary tracking-tight">Role & Access</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <FormSelect 
          name="role" 
          label="Staff Role" 
          options={ROLE_OPTIONS} 
          required 
        />

        <FormSelect 
          name="branchId" 
          label="Branch Location" 
          placeholderText="Select Branch"
          options={branchOptions} 
          required 
        />

        <div className="flex flex-col justify-end">
          <div className="flex items-center justify-between bg-surface-container-low px-4 py-3.5 rounded-xl border border-outline-variant/5">
            <span className="text-sm font-medium text-primary">Active Profile</span>
            <button 
              type="button"
              onClick={() => setValue('isActive', !isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-outline-variant/30'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
