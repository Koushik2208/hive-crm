'use client';

import React from 'react';
import { Service } from '@/types/services';
import { Clock, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUpdateService } from '@/hooks/useServices';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();
  const updateMutation = useUpdateService();

  const handleToggle = () => {
    updateMutation.mutate({
      id: service.id,
      data: { is_active: !service.is_active }
    });
  };

  const handleEdit = () => {
    router.push(`/services/${service.id}/edit`);
  };

  return (
    <div className="group flex items-center justify-between p-6 bg-surface-container-lowest rounded-[24px] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-outline-variant/10">
      <div className="flex-1">
        <h4 className="text-lg font-medium text-primary mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
          {service.name}
        </h4>
        <div className="flex items-center gap-4">
          {service.service_categories && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full border border-secondary/5">
              <div 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: service.service_categories.color_hex || '#6c538b' }} 
              />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">
                {service.service_categories.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-on-surface-variant/60 text-xs font-medium">
            <Clock size={14} className="opacity-70" />
            <span>{service.duration_mins} min</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="text-right">
          <span className="text-2xl font-light text-primary leading-none">
            ${Number(service.price).toFixed(2)}
          </span>
          <p className="text-[10px] text-outline uppercase tracking-widest mt-1.5 font-bold">
            {service.is_multi_staff ? 'Starting From' : 'Base Price'}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Toggle Switch */}
          <button 
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              service.is_active ? "bg-primary" : "bg-surface-container-high"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                service.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <button 
            onClick={handleEdit}
            className="p-3 text-outline-variant hover:text-primary hover:bg-surface-container-low transition-all duration-300 rounded-full cursor-pointer active:scale-90"
          >
            <Pencil size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
