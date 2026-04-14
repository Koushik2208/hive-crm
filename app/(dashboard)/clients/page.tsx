'use client';

import React from 'react';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientFilters from '@/components/clients/ClientFilters';
import ClientCard from '@/components/clients/ClientCard';
import Pagination from '@/components/ui/Pagination';
import { clientsData } from '@/lib/mockData';

import PageContainer from '@/components/layout/PageContainer';

const ClientsPage = () => {
  return (
    <PageContainer scrollable={true} className="space-y-8">
      {/* Page Header */}
      <ClientsHeader />

      {/* Filters Section */}
      <ClientFilters />

      {/* Clients Grid */}
      <section className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {clientsData.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <Pagination currentPage={1} totalPages={12} />
    </PageContainer>
  );
};

export default ClientsPage;