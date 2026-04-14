"use client";

import PageContainer from '@/components/layout/PageContainer';
import ClientForm from '@/components/clients/ClientForm';

export default function NewClientPage() {
  return (
    <PageContainer scrollable={true}>
      <ClientForm />
    </PageContainer>
  );
}
