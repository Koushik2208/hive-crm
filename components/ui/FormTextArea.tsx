"use client";

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextArea, TextAreaProps } from './TextArea';

interface FormTextAreaProps extends TextAreaProps {
  name: string;
}

/**
 * A thematic "Aura Velvet" form-connected textarea.
 * Automatically hooks into React Hook Form context for registration and error handling.
 */
export function FormTextArea({ name, ...props }: FormTextAreaProps) {
  const { 
    register, 
    formState: { errors } 
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <TextArea 
      {...register(name)}
      {...props}
      error={error}
    />
  );
}
