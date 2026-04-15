"use client";

import React, { useState } from 'react';
import { z } from "zod";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Save,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ClientCreateSchema, ClientCreateInput, ClientCreateFormInput } from '@/lib/validations/client.schema';
import { useCreateClient, useUpdateClient } from '@/hooks/useClients';
import { Client } from '@/types/clients';

// Sections
import { ClientBasicInfo } from './form/ClientBasicInfo';
import { ClientDetails } from './form/ClientDetails';
import { ClientClinicInfo } from './form/ClientClinicInfo';
import { ClientNotes } from './form/ClientNotes';

interface ClientFormProps {
  initialData?: Client;
  isEdit?: boolean;
}

// Internal type for form handling — use the input type for compatibility with zodResolver
type ClientFormValues = ClientCreateFormInput;

export default function ClientForm({ initialData, isEdit = false }: ClientFormProps) {
  const router = useRouter();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient(initialData?.id || '');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar_url || null);

  const methods = useForm<ClientFormValues>({
    resolver: zodResolver(ClientCreateSchema),
    defaultValues: initialData ? {
      firstName: initialData.first_name || '',
      lastName: initialData.last_name || '',
      email: initialData.email || undefined,
      phone: initialData.phone || undefined,
      dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : undefined,
      gender: (initialData.gender as any) || 'prefer_not_to_say',
      notes: initialData.notes || '',
      tags: initialData.tags || [],
      avatarUrl: initialData.avatar_url || undefined,
      medicalFlags: {
        allergies: (initialData.medical_flags as any)?.allergies || [],
        conditions: (initialData.medical_flags as any)?.conditions || [],
        medications: (initialData.medical_flags as any)?.medications || [],
      },
      beautyNotes: {
        hair_colour: (initialData.beauty_notes as any)?.hair_colour || '',
        last_colour_date: (initialData.beauty_notes as any)?.last_colour_date || '',
        preferred_stylist: (initialData.beauty_notes as any)?.preferred_stylist || '',
      },
    } : {
      firstName: '',
      lastName: '',
      email: undefined,
      phone: undefined,
      dob: undefined,
      gender: 'prefer_not_to_say',
      notes: '',
      tags: [],
      avatarUrl: undefined,
      medicalFlags: {
        allergies: [],
        conditions: [],
        medications: [],
      },
      beautyNotes: {
        hair_colour: '',
        last_colour_date: '',
        preferred_stylist: '',
      },
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (values: ClientCreateInput) => {
    try {
      if (isEdit && initialData) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      router.push('/clients');
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // In a real app, you'd upload this to S3/Supabase and set the URL in the form
        // For now, we just show the preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="px-0 pt-0 pb-12 animate-in fade-in duration-500">
        {/* Top Header & Global Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="text-primary" size={24} />
            </button>
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              {isEdit ? 'Edit Client Profile' : 'Add New Client'}
            </h2>
          </div>
          <Button
            onClick={handleSubmit(onSubmit as any)}
            disabled={isSubmitting}
            className="px-8 py-3.5 shadow-lg shadow-primary/10"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isEdit ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>

        {/* Form Container */}
        <div className="bg-surface-container-lowest rounded-[40px] p-12 shadow-ambient border border-outline-variant/10">
          <form className="space-y-20" onSubmit={handleSubmit(onSubmit as any)}>

            <ClientBasicInfo
              avatarPreview={avatarPreview}
              onImageChange={handleImageChange}
            />

            <ClientDetails />

            <ClientClinicInfo />

            <ClientNotes />

          </form>
        </div>
      </div>
    </FormProvider>
  );

}
