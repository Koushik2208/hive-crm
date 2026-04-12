"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, InputProps } from './Input';

interface FormInputProps extends InputProps {
  name: string;
}

/**
 * A thematic "Aura Velvet" form-connected input.
 * Automatically hooks into React Hook Form context for registration and error handling.
 */
export function FormInput({ name, ...props }: FormInputProps) {
  const { 
    register, 
    formState: { errors } 
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <Input 
      {...register(name)}
      {...props}
      error={error}
    />
  );
}
