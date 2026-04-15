'use client';

import React from 'react';
import { useServices, useServiceCategories } from '@/hooks/useServices';
import { useSearchStore } from '@/stores/searchStore';
import { ServiceGroup } from './ServiceGroup';
import { Loader2, SearchX } from 'lucide-react';

interface ServiceListProps {
  selectedCategoryId: string;
}

export function ServiceList({ selectedCategoryId }: ServiceListProps) {
  const { searchQuery } = useSearchStore();
  
  const { data: servicesData, isLoading: servicesLoading } = useServices({
    categoryId: selectedCategoryId,
    search: searchQuery,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useServiceCategories();

  if (servicesLoading || categoriesLoading) {
    return (
      <div className="flex flex-col gap-8 h-96 items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={48} />
        <p className="text-on-surface-variant/60 font-medium animate-pulse">
          Crafting your service menu...
        </p>
      </div>
    );
  }

  const services = servicesData?.data || [];
  const categories = categoriesData?.data || [];

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-surface-container-low/20 rounded-[40px] border-2 border-dashed border-outline-variant/20 p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
          <SearchX className="text-outline-variant" size={32} />
        </div>
        <h4 className="text-xl font-bold text-primary mb-2">No services found</h4>
        <p className="text-on-surface-variant/60 max-w-sm">
          Try adjusting your search or category filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // Group services by category
  // If a specific category is selected, we only have services for that category.
  // However, we still want to show the category header.
  
  const groupServices = () => {
    const groups: { [key: string]: typeof services } = {};
    
    services.forEach(service => {
      const catId = service.category_id || 'uncategorized';
      if (!groups[catId]) groups[catId] = [];
      groups[catId].push(service);
    });

    return groups;
  };

  const grouped = groupServices();

  return (
    <div className="space-y-16 pb-20">
      {Object.entries(grouped).map(([catId, catServices]) => {
        const category = categories.find(c => c.id === catId);
        return (
          <ServiceGroup
            key={catId}
            categoryName={category?.name || 'Uncategorized'}
            categoryColor={category?.color_hex}
            services={catServices}
          />
        );
      })}
    </div>
  );
}
