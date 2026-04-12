"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, SelectProps } from './Select';

interface FormSelectProps extends SelectProps {
  name: string;
}

/**
 * A thematic "Aura Velvet" form-connected select component.
 * Automatically hooks into React Hook Form context for registration and error handling.
 */
export function FormSelect({ name, ...props }: FormSelectProps) {
  const { 
    register, 
    formState: { errors } 
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <Select 
      {...register(name)}
      {...props}
      error={error}
    />
  );
}
