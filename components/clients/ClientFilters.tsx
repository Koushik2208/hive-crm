'use client';

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

interface ClientFiltersProps {
  selectedTag: string;
  status: string;
  onFilterChange: (key: string, value: string) => void;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({ 
  selectedTag, 
  status, 
  onFilterChange 
}) => {
  return (
    <section>
      <div className="bg-surface-container-low p-2 rounded-2xl flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Tag"
          value={selectedTag || "All Tags"}
          options={['All Tags', 'VIP', 'Regular', 'New', 'Lead']}
          onSelect={(val) => onFilterChange('tag', val)}
        />
        <FilterDropdown
          label="Status"
          value={status || "All Status"}
          options={['All Status', 'Active', 'Inactive']}
          onSelect={(val) => onFilterChange('status', val)}
        />
        <FilterDropdown
          label="Activity"
          value="All Time"
          options={['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months']}
          onSelect={() => { }}
        />

        <div className="ml-auto flex items-center gap-2 pr-2">
          <FilterDropdown
            label="Sort By"
            value="First Name"
            options={['First Name', 'Last Name', 'Created At']}
            onSelect={() => { }}
          />
        </div>
      </div>
    </section>
  );
};

export default ClientFilters;
