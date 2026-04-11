"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar';
import StaffFilterBar from '@/components/appointments/StaffFilterBar';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { appointmentsData, staffList } from '@/lib/mockData';

export default function AppointmentsPage() {
  const [calendarView, setCalendarView] = useState("Day");

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full relative">
      <section className="px-8 py-6 shrink-0 bg-surface-bright flex flex-col gap-6">
        
        {/* Calendar Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft size={24} />
              </Button>
              <h2 className="text-2xl font-bold tracking-tight text-primary">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
              <Button variant="ghost" size="icon">
                <ChevronRight size={24} />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Today
            </Button>
          </div>
          
          <SegmentedControl 
            options={['Day', 'Week', 'Month']} 
            activeValue={calendarView} 
            onChange={setCalendarView} 
          />
        </div>

        {/* Staff Filters */}
        <StaffFilterBar staffList={staffList} />
      </section>

      {/* Main Grid */}
      <AppointmentCalendar appointments={appointmentsData} staffList={staffList} />

      {/* Global FAB */}
      <FloatingActionButton />
    </div>
  );
}
