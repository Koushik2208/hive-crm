"use client";

import React, { Suspense, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import AppointmentCalendarDay from '@/components/appointments/AppointmentCalendarDay';
import AppointmentCalendarWeek from '@/components/appointments/AppointmentCalendarWeek';
import AppointmentCalendarMonth from '@/components/appointments/AppointmentCalendarMonth';
import StaffFilterBar from '@/components/appointments/StaffFilterBar';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useAppointments } from '@/hooks/useAppointments';
import PageContainer from '@/components/layout/PageContainer';
import Drawer from '@/components/ui/Drawer';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { AppointmentWithDetails } from '@/types';

function AppointmentsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerProps, setDrawerProps] = useState<{
    isEdit?: boolean;
    initialData?: any;
    prefill?: { startsAt?: string; staffId?: string };
  }>({});

  const view = searchParams.get("view") || "day";
  const dateParam = searchParams.get("date");
  const staffIdParam = searchParams.get("staff_id");

  const currentDate = dateParam || new Date().toISOString().split('T')[0];

  // Compute boundaries for API fetching based on view
  let dateFrom = currentDate;
  let dateTo = currentDate;
  const d = new Date(currentDate);

  if (view === "week") {
    const day = d.getDay() || 7; // 1=Mon, 7=Sun
    d.setDate(d.getDate() - day + 1); // Monday
    dateFrom = d.toISOString().split('T')[0];
    d.setDate(d.getDate() + 6); // Sunday
    dateTo = d.toISOString().split('T')[0];
  } else if (view === "month") {
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const fdow = firstDay.getDay() || 7;
    firstDay.setDate(firstDay.getDate() - fdow + 1);
    const ldow = lastDay.getDay() || 7;
    lastDay.setDate(lastDay.getDate() + (7 - ldow));
    dateFrom = firstDay.toISOString().split('T')[0];
    dateTo = lastDay.toISOString().split('T')[0];
  }

  // Helper to push URL params
  const setUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const { appointments, staffList, isLoading, error } = useAppointments(dateFrom, dateTo);

  let displayDate = "";
  if (view === "day") {
    displayDate = new Date(currentDate).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  } else if (view === "week") {
    const from = new Date(dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = new Date(dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    displayDate = `${from} - ${to}`;
  } else if (view === "month") {
    displayDate = new Date(currentDate).toLocaleDateString('en-US', {
      month: 'long', year: 'numeric'
    });
  }

  const shiftDate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === "day") {
      d.setDate(d.getDate() + dir);
    } else if (view === "week") {
      d.setDate(d.getDate() + (dir * 7));
    } else if (view === "month") {
      d.setMonth(d.getMonth() + dir);
    }
    setUrlParams({ date: d.toISOString().split('T')[0] });
  };

  const isSingleStaffView = view === "week" || view === "month";
  const effectiveStaffId = isSingleStaffView && !staffIdParam && staffList.length > 0
    ? staffList[0].id
    : staffIdParam;

  const handleOpenDrawer = (props: typeof drawerProps = {}) => {
    setDrawerProps(props);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Optional: delay clearing props slightly to avoid flicker during slide-out animation
    setTimeout(() => {
      setDrawerProps({});
    }, 300);
  };

  return (
    <PageContainer scrollable={false} maxWidth="max-w-none" className="p-0 flex flex-col gap-4">
      <section className="px-8 pt-4 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => shiftDate(-1)}>
                <ChevronLeft size={24} />
              </Button>
              <h2 className="text-xl font-bold tracking-tight text-primary whitespace-nowrap min-w-[200px] text-center">
                {displayDate}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => shiftDate(1)}>
                <ChevronRight size={24} />
              </Button>
            </div>
          </div>

          <SegmentedControl
            options={['Day', 'Week', 'Month']}
            activeValue={view.charAt(0).toUpperCase() + view.slice(1)}
            onChange={(val) => setUrlParams({ view: val.toLowerCase() })}
          />
        </div>

        {!isLoading || staffList.length > 0 ? (
          <StaffFilterBar
            staffList={staffList}
            activeStaffId={effectiveStaffId}
            onStaffSelect={(id) => setUrlParams({ staff_id: id })}
            disableAllTeam={isSingleStaffView}
          />
        ) : (
          <div className="h-10 flex items-center text-sm text-outline animate-pulse">Loading staff...</div>
        )}
      </section>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col relative">
        {/* Global Loading Overlay for Re-fetching */}
        {(isLoading && (appointments.length > 0 || staffList.length > 0)) && (
          <div className="absolute top-4 right-8 z-50 flex items-center gap-2 bg-surface/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline-variant/20 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
            <Loader2 className="animate-spin w-3.5 h-3.5 text-primary" />
            <span className="text-[0.65rem] font-bold text-primary uppercase tracking-wider">Syncing...</span>
          </div>
        )}

        {error ? (
          <div className="flex items-center justify-center p-12 text-error font-medium">
            Error loading appointments: {error.message || error}
          </div>
        ) : isLoading && appointments.length === 0 && staffList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 text-outline">
             <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin w-10 h-10 text-primary/40" />
                <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant/40">Initializing calendar...</p>
             </div>
          </div>
        ) : (
          <>
            {view === "day" && (
              <AppointmentCalendarDay
                appointments={appointments}
                staffList={staffList}
                onCellClick={(staffId, time) => handleOpenDrawer({ prefill: { staffId, startsAt: time } })}
                onAppointmentClick={(apt) => handleOpenDrawer({ isEdit: true, initialData: apt })}
              />
            )}

            {view === "week" && (
              <AppointmentCalendarWeek
                appointments={appointments}
                activeDate={currentDate}
                effectiveStaffId={effectiveStaffId}
                onDayClick={(dateStr, scrollPos) => setUrlParams({ view: "day", date: dateStr, scroll: scrollPos || null })}
                onAppointmentClick={(apt) => handleOpenDrawer({ isEdit: true, initialData: apt })}
              />
            )}

            {view === "month" && (
              <AppointmentCalendarMonth
                appointments={appointments}
                activeDate={currentDate}
                effectiveStaffId={effectiveStaffId}
                onDayClick={(dateStr, scrollPos) => setUrlParams({ view: "day", date: dateStr, scroll: scrollPos || null })}
                onAppointmentClick={(apt) => handleOpenDrawer({ isEdit: true, initialData: apt })}
              />
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => handleOpenDrawer()} />

      {/* Appointment Creation/Editing Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={drawerProps.isEdit ? 'Edit Appointment' : 'New Appointment'}
        subtitle={
          drawerProps.isEdit ? (
            <span className="text-[0.7rem] uppercase tracking-widest text-on-surface-variant/60 font-bold mt-1 block">
              Manage Details
            </span>
          ) : (
            <span className="text-[0.7rem] uppercase tracking-widest text-on-surface-variant/40 font-bold mt-1 block">
              Schedule New
            </span>
          )
        }
      >
        <AppointmentForm
          {...drawerProps}
          calendarDate={currentDate}
          staffList={staffList}
          onClose={handleCloseDrawer}
        />
      </Drawer>
    </PageContainer>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>}>
      <AppointmentsPageContent />
    </Suspense>
  );
}
