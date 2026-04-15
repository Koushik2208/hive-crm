"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TagInput, TagInputProps } from './TagInput';

interface FormTagInputProps extends Omit<TagInputProps, 'value' | 'onChange'> {
  name: string;
}

/**
 * A thematic "Aura Velvet" form-connected TagInput component.
 * Uses React Hook Form Controller to manage string array state.
 */
export function FormTagInput({ name, ...props }: FormTagInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TagInput
          {...props}
          value={field.value || []}
          onChange={field.onChange}
          error={error?.message}
        />
      )}
    />
  );
}
