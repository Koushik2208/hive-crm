"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ArrowLeft, 
  Save, 
  Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StaffCreateSchema, StaffFormValues, StaffCreateInput } from '@/lib/validations/staff.schema';
import { useBranches } from '@/hooks/useBranches';
import { useCreateStaff, useUpdateStaff } from '@/hooks/useStaff';
import { StaffMember } from '@/types/staff';

// Modular Sections
import { BasicInfoSection } from './form/BasicInfoSection';
import { RoleAccessSection } from './form/RoleAccessSection';
import { ProfessionalSection } from './form/ProfessionalSection';
import AvailabilityGrid from './AvailabilityGrid';

interface StaffFormProps {
  initialData?: StaffMember;
  isEdit?: boolean;
}

const DEFAULT_AVAILABILITY = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
  { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
  { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '18:00', isAvailable: false },
  { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isAvailable: false },
];

const formatTime = (time: any): string => {
  if (!time) return '09:00';
  
  // If it's a Date object
  if (time instanceof Date) {
    const h = time.getUTCHours().toString().padStart(2, '0');
    const m = time.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
  
  // If it's an ISO/Date string (e.g., "1970-01-01T09:00:00Z")
  if (typeof time === 'string' && time.includes('T')) {
    const timePart = time.split('T')[1];
    return timePart ? timePart.substring(0, 5) : '09:00';
  }
  
  // If it's already a time string or simple format
  if (typeof time === 'string') {
    // Check if it's like "09:00:00" or just "09:00"
    return time.includes(':') ? time.substring(0, 5) : '09:00';
  }
  
  return '09:00';
};

/**
 * Enhanced StaffForm featuring modular sections and automated RHF components.
 * Optimized for maintainability and Type Safety.
 */
export default function StaffForm({ initialData, isEdit = false }: StaffFormProps) {
  const router = useRouter();
  const { data: branches } = useBranches();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff(initialData?.id || '');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.users?.avatar_url || null);

  const methods = useForm<StaffFormValues>({
    resolver: zodResolver(StaffCreateSchema),
    defaultValues: initialData ? {
      firstName: initialData.users?.first_name || '',
      lastName: initialData.users?.last_name || '',
      email: initialData.users?.email || '',
      phone: initialData.users?.phone || '',
      role: (initialData.users?.role as StaffFormValues['role']) || 'staff',
      branchId: initialData.branch_id || '',
      bio: initialData.bio || '',
      commissionRate: initialData.commission_rate ? Number(initialData.commission_rate) : 15,
      colorHex: initialData.color_hex || '#32172a',
      isActive: initialData.users?.is_active ?? true,
      availability: initialData.staff_availability?.map(a => ({
        dayOfWeek: a.day_of_week ?? 0,
        startTime: formatTime(a.start_time),
        endTime: formatTime(a.end_time),
        isAvailable: a.is_available ?? false,
      })) || DEFAULT_AVAILABILITY,
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'staff',
      branchId: '',
      bio: '',
      commissionRate: 15,
      colorHex: '#32172a',
      isActive: true,
      availability: DEFAULT_AVAILABILITY,
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = async (data: StaffFormValues) => {
    try {
      if (isEdit && initialData) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      router.push('/staff');
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
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="px-0 pt-0 pb-12">
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
              {isEdit ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
          </div>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-3.5"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isEdit ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>

        {/* Modular Form Layout */}
        <div className="bg-surface-container-lowest rounded-4xl p-10 shadow-ambient border border-outline-variant/10">
          <form className="space-y-16" onSubmit={handleSubmit(onSubmit)}>
            
            <BasicInfoSection 
              avatarPreview={avatarPreview} 
              onImageChange={handleImageChange} 
              isEdit={isEdit} 
            />

            <RoleAccessSection branches={branches} />

            <ProfessionalSection />

            <AvailabilityGrid />
            
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
