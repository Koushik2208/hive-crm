import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Service, ServicesApiResponse, ServiceCategoriesApiResponse } from '@/types/services';
import { ServiceUpdateInput, ServiceCreateInput } from '@/lib/validations/service.schema';

interface UseServicesOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

export function useServices(options: UseServicesOptions = {}) {
  const { page = 1, limit = 100, search, categoryId, isActive } = options;

  return useQuery({
    queryKey: ['services', page, limit, search, categoryId, isActive],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (categoryId && categoryId !== 'all') params.append('category_id', categoryId);
      if (isActive !== undefined) params.append('is_active', isActive.toString());

      const response = await fetch(`/api/v1/services?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json() as Promise<ServicesApiResponse>;
    },
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const response = await fetch('/api/v1/service-categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json() as Promise<ServiceCategoriesApiResponse>;
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceUpdateInput }) => {
      const response = await fetch(`/api/v1/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update service');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', variables.id] });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; color_hex?: string }) => {
      const response = await fetch('/api/v1/service-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; color_hex?: string } }) => {
      const response = await fetch(`/api/v1/service-categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/v1/service-categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/services/${id}`);
      if (!response.ok) throw new Error('Failed to fetch service');
      const result = await response.json();
      return result.data as Service;
    },
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceCreateInput) => {
      const response = await fetch('/api/v1/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create service');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
