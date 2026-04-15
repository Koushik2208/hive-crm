'use client';

import React from 'react';
import { ServiceForm } from '@/components/services/ServiceForm';
import { useService, useUpdateService } from '@/hooks/useServices';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: service, isLoading: isServiceLoading } = useService(id);
  const updateMutation = useUpdateService();

  const handleSubmit = (data: any) => {
    updateMutation.mutate({
      id,
      data
    }, {
      onSuccess: () => {
        router.push('/services');
      }
    });
  };

  if (isServiceLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="animate-spin text-secondary" size={48} />
          <p className="text-on-surface-variant/60 font-medium">Fetching service details...</p>
        </div>
      </PageContainer>
    );
  }

  if (!service) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <p className="text-on-surface-variant font-bold text-xl">Service not found</p>
          <button
            onClick={() => router.push('/services')}
            className="text-secondary hover:underline font-medium"
          >
            Back to services
          </button>
        </div>
      </PageContainer>
    );
  }

  // Pre-process data for the form (e.g. converting numeric strings if necessary)
  const initialData = {
    ...service,
    price: Number(service.price),
    // Ensure category and branch IDs match the frontend camelCase convention
    categoryId: service.category_id || null,
    branchId: service.branch_id || null,
  };

  return (
    <PageContainer>
      <div className="py-12">
        <ServiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isLoading}
          title="Update Service"
        />
      </div>
    </PageContainer>
  );
}
