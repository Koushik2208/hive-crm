"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import StaffForm from '@/components/staff/StaffForm';
import { useStaffMember } from '@/hooks/useStaff';
import { Loader2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export default function EditStaffPage() {
  const { id } = useParams();
  const { data: staff, isLoading, error } = useStaffMember(id as string);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface p-6 text-center">
        <h2 className="text-xl font-bold text-primary mb-2">Staff Member Not Found</h2>
        <p className="text-on-surface-variant mb-6">The profile you are trying to edit does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <PageContainer scrollable={true} className="px-4">
      <StaffForm initialData={staff} isEdit={true} />
    </PageContainer>
  );
}
