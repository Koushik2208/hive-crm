'use client';

import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { ServicesHeader } from '@/components/services/ServicesHeader';
import { CategoryFilter } from '@/components/services/CategoryFilter';
import { ServiceList } from '@/components/services/ServiceList';

export default function ServicesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  return (
    <PageContainer scrollable={true} className="space-y-8">
      {/* Page Header */}
      <ServicesHeader />

      {/* Category Filter Pills */}
      <CategoryFilter
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Dynamic Service List */}
      <ServiceList selectedCategoryId={selectedCategoryId} />
    </PageContainer>
  );
}