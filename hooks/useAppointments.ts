"use client";

import { useQuery } from '@tanstack/react-query';
import { AppointmentWithDetails, StaffProfileWithDetails } from '@/types';

interface AppointmentsData {
  appointments: AppointmentWithDetails[];
  staffList: StaffProfileWithDetails[];
}

/**
 * Hook to fetch appointments and staff for the calendar.
 * Uses TanStack Query for caching, re-fetching, and unified data management.
 */
export function useAppointments(dateFrom: string, dateTo: string) {
  // We fetch both in parallel via a single query or separate ones.
  // Separate ones are better for caching granularity.
  
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
    // Keep data fresh longer for the calendar but allow background updates
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    appointments: appointmentsQuery.data || [],
    staffList: staffQuery.data || [],
    isLoading: staffQuery.isLoading || appointmentsQuery.isLoading,
    isError: staffQuery.isError || appointmentsQuery.isError,
    error: (staffQuery.error || appointmentsQuery.error) as string | null,
    refetch: () => {
      staffQuery.refetch();
      appointmentsQuery.refetch();
    }
  };
}
