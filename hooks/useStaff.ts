import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaffApiResponse, StaffMember } from '@/types';
import { StaffFormValues } from '@/lib/validations/staff.schema';

interface UseStaffOptions {
  branch_id?: string;
  is_active?: boolean;
  role?: string;
  include_schedule?: boolean;
}

export function useStaff(options: UseStaffOptions = {}) {
  const { 
    branch_id, 
    is_active, 
    role, 
    include_schedule = true 
  } = options;

  return useQuery({
    queryKey: ['staff', branch_id, is_active, role, include_schedule],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (branch_id) params.append('branch_id', branch_id);
      if (is_active !== undefined) params.append('is_active', is_active.toString());
      if (role && role !== 'All Roles') params.append('role', role);
      if (include_schedule) params.append('include_schedule', 'true');

      const response = await fetch(`/api/v1/staff?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }
      return response.json() as Promise<StaffApiResponse<true>>;
    },
  });
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/staff/${id}`);
      if (!response.ok) throw new Error('Failed to fetch staff member');
      const result = await response.json();
      return result.data as StaffMember<true>;
    },
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StaffFormValues) => {
      const response = await fetch('/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create staff');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
    },
  });
}

export function useUpdateStaff(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: StaffFormValues) => {
      const response = await fetch(`/api/v1/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update staff');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      queryClient.invalidateQueries(['staff', id]);
    },
  });
}
