'use client';

import React, { useState } from 'react';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientFilters from '@/components/clients/ClientFilters';
import ClientCard from '@/components/clients/ClientCard';
import Pagination from '@/components/ui/Pagination';
import { useClients } from '@/hooks/useClients';
import { Loader2 } from 'lucide-react';

import PageContainer from '@/components/layout/PageContainer';

const ClientsPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    tag: 'All Tags',
    status: 'All Status',
    search: '',
  });

  const { data, isLoading, error } = useClients({
    page,
    limit: 12,
    tag: filters.tag,
    status: filters.status,
    search: filters.search,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clients = data?.data || [];
  const meta = data?.meta;

  return (
    <PageContainer scrollable={true} className="space-y-8">
      {/* Page Header */}
      <ClientsHeader />

      {/* Filters Section */}
      <ClientFilters 
        selectedTag={filters.tag}
        status={filters.status}
        onFilterChange={handleFilterChange}
      />

      {/* Clients Grid */}
      <section className="flex-1">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary" size={32} />
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center bg-red-50 rounded-3xl p-8 border border-red-100">
            <p className="text-red-600 font-medium">Failed to load clients.</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-surface-container-low/30 rounded-3xl p-8 border-2 border-dashed border-outline-variant/20">
            <p className="text-on-surface-variant font-medium">No clients found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <Pagination 
          currentPage={meta.page} 
          totalPages={meta.pages} 
          onPageChange={setPage}
        />
      )}
    </PageContainer>
  );
};

export default ClientsPage;