'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceCreateSchema, ServiceFormValues } from '@/lib/validations/service.schema';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sections
import { ServiceBasicInfo } from './form/ServiceBasicInfo';
import { ServicePricing } from './form/ServicePricing';
import { ServiceSettings } from './form/ServiceSettings';
import { ServiceSummary } from './form/ServiceSummary';

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: ServiceFormValues) => void;
  isLoading?: boolean;
  title?: string;
}

export function ServiceForm({ initialData, onSubmit, isLoading, title = "Add Service" }: ServiceFormProps) {
  const router = useRouter();

  const methods = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceCreateSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      duration_mins: 60,
      buffer_mins: 15,
      price: 0,
      is_active: true,
      is_multi_staff: false,
      categoryId: '',
      branchId: '',
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const handleFormSubmit = async (values: ServiceFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Standardized Header (Matches ClientForm) */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="text-primary" size={24} />
            </button>
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              {title}
            </h2>
          </div>
          
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoading || isSubmitting}
            className="px-8 py-3.5 shadow-lg shadow-primary/10"
          >
            {isLoading || isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {initialData ? 'Save Changes' : 'Create Service'}
          </Button>
        </div>

        {/* Asymmetric Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Basic Information */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <ServiceBasicInfo />
            </form>
          </div>

          {/* Right Column: Pricing, Settings & Summary */}
          <div className="lg:col-span-4 space-y-10">
            <ServicePricing />
            <ServiceSummary />
            <ServiceSettings />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
