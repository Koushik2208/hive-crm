import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientsApiResponse, Client } from '@/types/clients';
import { ClientCreateInput, ClientUpdateInput } from '@/lib/validations/client.schema';

interface UseClientsOptions {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  status?: string;
}

export function useClients(options: UseClientsOptions = {}) {
  const { page = 1, limit = 10, search, tag, status } = options;

  return useQuery({
    queryKey: ['clients', page, limit, search, tag, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (tag && tag !== 'All Tags') params.append('tag', tag);
      if (status && status !== 'All Status') params.append('status', status);

      const response = await fetch(`/api/v1/clients?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      return response.json() as Promise<ClientsApiResponse>;
    },
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/clients/${id}`);
      if (!response.ok) throw new Error('Failed to fetch client');
      const result = await response.json();
      return result.data as Client;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClientCreateInput) => {
      const response = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create client');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
    },
  });
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClientUpdateInput) => {
      const response = await fetch(`/api/v1/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update client');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      queryClient.invalidateQueries(['clients', id]);
    },
  });
}
