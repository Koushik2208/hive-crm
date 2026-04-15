"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { StaffSelect, StaffSelectProps } from './StaffSelect';

interface FormStaffSelectProps extends Omit<StaffSelectProps, 'value' | 'onChange'> {
  name: string;
}

/**
 * A thematic "Aura Velvet" form-connected StaffSelect component.
 */
export function FormStaffSelect({ name, ...props }: FormStaffSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <StaffSelect
          {...props}
          value={field.value || ''}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  );
}
