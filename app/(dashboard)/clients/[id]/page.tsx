"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import ClientForm from '@/components/clients/ClientForm';
import { useClient } from '@/hooks/useClients';
import { Loader2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';

export default function EditClientPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: client, isLoading, error } = useClient(id);

  if (isLoading) {
    return (
      <PageContainer scrollable={false}>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-secondary" size={40} />
          <p className="text-on-surface-variant font-medium animate-pulse">Fetching client profile...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !client) {
    return (
      <PageContainer scrollable={false}>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            Client not found or an error occurred.
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={true}>
      <ClientForm initialData={client} isEdit={true} />
    </PageContainer>
  );
}
