'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { FormSelect } from '@/components/ui/FormSelect';
import { useServiceCategories } from '@/hooks/useServices';
import { useBranches } from '@/hooks/useBranches';

export function ServiceBasicInfo() {
  const { data: categoriesData } = useServiceCategories();
  const { data: branchesData } = useBranches();

  const categories = categoriesData?.data || [];
  const branches = branchesData || [];

  return (
    <div className="bg-surface-container-lowest rounded-[40px] p-12 shadow-ambient border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-6 bg-secondary rounded-full" />
        <h3 className="text-xl font-bold text-primary tracking-tight">Basic Information</h3>
      </div>

      <div className="space-y-10">
        <FormInput
          name="name"
          label="Service Name"
          placeholder="e.g. Velvet Silk Facial Treatment"
          className="text-lg font-medium"
        />

        <FormTextArea
          name="description"
          label="Description"
          placeholder="Describe the therapeutic benefits and luxury experience..."
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <FormSelect
            name="categoryId"
            label="Category"
            placeholderText="Select Category"
            options={categories.map(c => ({ label: c.name || 'Unnamed', value: c.id }))}
          />

          <FormSelect
            name="branchId"
            label="Branch Selection"
            placeholderText="Select Branch"
            options={branches.map(b => ({ label: b.name, value: b.id }))}
          />
        </div>
      </div>
    </div>
  );
}
