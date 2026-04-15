'use client';

import React from 'react';
import { ServiceForm } from '@/components/services/ServiceForm';
import { useCreateService } from '@/hooks/useServices';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';

export default function NewServicePage() {
  const router = useRouter();
  const createMutation = useCreateService();

  const handleSubmit = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/services');
      }
    });
  };

  return (
    <PageContainer>
      <div className="py-12">
        <ServiceForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading}
          title="Add Service"
        />
      </div>
    </PageContainer>
  );
}
