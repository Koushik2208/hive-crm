import React from 'react';
import { Service } from '@/types/services';
import { ServiceCard } from './ServiceCard';

interface ServiceGroupProps {
  categoryName: string;
  categoryColor?: string | null;
  services: Service[];
}

export function ServiceGroup({ categoryName, categoryColor, services }: ServiceGroupProps) {
  if (services.length === 0) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6 ml-1">
        <div 
          className="w-2 h-8 rounded-full shadow-sm" 
          style={{ backgroundColor: categoryColor || '#6c538b' }} 
        />
        <h3 className="text-2xl font-bold text-primary tracking-tight">
          {categoryName}
        </h3>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-outline-variant mt-1 ml-4 opacity-70">
          {services.length} {services.length === 1 ? 'Service' : 'Services'}
        </span>
      </div>
      
      <div className="space-y-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
