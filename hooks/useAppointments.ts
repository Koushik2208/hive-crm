import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentWithDetails, StaffProfileWithDetails } from '@/types';
import { AppointmentCreateInput, AppointmentUpdateInput } from '@/lib/validations/appointment.schema';

/**
 * Hook to fetch appointments and staff for the calendar.
 */
export function useAppointments(dateFrom: string, dateTo: string) {
  const staffQuery = useQuery({
    queryKey: ['staff', 'active'],
    queryFn: async () => {
      const res = await fetch('/api/v1/staff?is_active=true');
      if (!res.ok) throw new Error('Failed to fetch staff');
      const json = await res.json();
      return json.data as StaffProfileWithDetails[];
    }
  });

  const appointmentsQuery = useQuery({
    queryKey: ['appointments', dateFrom, dateTo],
    queryFn: async () => {
      const res = await fetch(`/api/v1/appointments?date_from=${dateFrom}&date_to=${dateTo}`);
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const json = await res.json();
      return json.data as AppointmentWithDetails[];
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    appointments: appointmentsQuery.data || [],
    staffList: staffQuery.data || [],
    isLoading: staffQuery.isLoading || appointmentsQuery.isLoading,
    isRefetching: appointmentsQuery.isRefetching,
    isError: staffQuery.isError || appointmentsQuery.isError,
    error: (staffQuery.error || appointmentsQuery.error) as any,
    refetch: () => {
      staffQuery.refetch();
      appointmentsQuery.refetch();
    }
  };
}

/**
 * Mutation to create a new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AppointmentCreateInput) => {
      const res = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create appointment');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

/**
 * Mutation to update/reschedule an appointment
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AppointmentUpdateInput }) => {
      const res = await fetch(`/api/v1/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update appointment');
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', variables.id] });
    },
  });
}

/**
 * Mutation to delete an appointment
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/appointments/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete appointment');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
