'use client';

import React from 'react';
import { FilterDropdown } from '@/components/ui/FilterDropdown';

const ClientFilters = () => {
  return (
    <section>
      <div className="bg-surface-container-low p-2 rounded-2xl flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Tags"
          value="VIP, Regular"
          options={['VIP', 'Regular', 'New', 'Lead']}
          onSelect={() => { }}
        />
        <FilterDropdown
          label="Status"
          value="Active"
          options={['Active', 'Inactive', 'All Status']}
          onSelect={() => { }}
        />
        <FilterDropdown
          label="Activity"
          value="Recent Activity"
          options={['Last 7 Days', 'Last 30 Days', 'Last 6 Months']}
          onSelect={() => { }}
        />

        <div className="ml-auto flex items-center gap-2 pr-2">
          <FilterDropdown
            label="Sort By"
            value="Last Seen"
            options={['Name (A-Z)', 'Last Seen', 'Recent Activity']}
            onSelect={() => { }}
          />
        </div>
      </div>
    </section>
  );
};

export default ClientFilters;
