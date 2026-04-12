import React from 'react';
import { AppointmentWithDetails } from '@/types';

interface AppointmentCalendarMonthProps {
  appointments: AppointmentWithDetails[];
  activeDate: string; // The selected day controlling the month shown
  effectiveStaffId: string | null;
  onDayClick: (dateStr: string, scrollY?: string) => void;
  onAppointmentClick: (appointment: AppointmentWithDetails) => void;
}

export default function AppointmentCalendarMonth({
  appointments,
  activeDate,
  effectiveStaffId,
  onDayClick,
  onAppointmentClick
}: AppointmentCalendarMonthProps) {
  const baseDate = new Date(activeDate);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-11

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Buffer days for previous month to align to Monday=1
  const startDayOfWeek = firstDayOfMonth.getDay() || 7;
  const daysInPrevMonth = startDayOfWeek - 1;

  // Buffer days for next month to align to Sunday=7
  const endDayOfWeek = lastDayOfMonth.getDay() || 7;
  const daysInNextMonth = 7 - endDayOfWeek;

  // Total grid cells (often 35 or 42)
  const totalDays = daysInPrevMonth + lastDayOfMonth.getDate() + daysInNextMonth;

  // Build the dates matrix
  const matrix = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(year, month, 1 - daysInPrevMonth + i);
    return {
      dateObj: d,
      dateString: d.toLocaleDateString('en-CA'),
      dayNumber: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: d.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA'),
    };
  });

  // Filter out the staff member's appointments
  const staffAppointments = appointments.filter(a => a.staff_id === effectiveStaffId);

  return (
    <section className="flex-1 px-8 min-h-0 flex flex-col w-full relative">
      <div className="bg-surface-container-low rounded-3xl overflow-hidden flex-1 border-t-0 min-h-0 flex flex-col p-2">

        {/* Month Header (Mon-Sun labels) */}
        <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
            <div key={dayName} className="text-center py-2 text-[0.65rem] font-bold text-outline uppercase tracking-wider">
              {dayName}
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div className="flex-1 w-full overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-outline-variant hover:scrollbar-thumb-secondary scrollbar-track-transparent pr-1">
          <div className="grid grid-cols-7 auto-rows-[minmax(140px,1fr)] gap-1 min-h-full">
            {matrix.map((cell) => {
              // Find appointments for this particular day
              const dayAppointments = staffAppointments.filter((apt) => {
                const aptDateObj = new Date(apt.starts_at!);
                return aptDateObj.toLocaleDateString('en-CA') === cell.dateString;
              });

              return (
                <div
                  key={cell.dateString}
                  onClick={() => onDayClick(cell.dateString)}
                  className={`flex flex-col bg-surface rounded-xl overflow-hidden border border-transparent transition-all cursor-pointer group ${cell.isCurrentMonth ? '' : 'opacity-40 bg-surface-container-low/50'
                    } ${cell.isToday ? 'ring-2 ring-primary ring-inset' : 'hover:border-outline-variant hover:shadow-sm'
                    }`}
                >
                  {/* Cell Header (Day Number) */}
                  <div className="flex justify-start p-2 shrink-0">
                    <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${cell.isToday ? 'bg-primary text-white' : 'text-secondary group-hover:text-primary'
                      }`}>
                      {cell.dayNumber}
                    </span>
                  </div>

                  {/* Cell Body (Pills) */}
                  <div className="flex-1 flex flex-col gap-1 px-2 pb-2 overflow-y-auto scrollbar-hide">
                    {dayAppointments.slice(0, 4).map((apt) => {
                      // Determine pill color by status
                      let pillColor = 'bg-surface-container text-secondary';
                      switch (apt.status) {
                        case 'confirmed': pillColor = 'bg-tertiary-fixed text-on-tertiary-fixed'; break;
                        case 'in_progress': pillColor = 'bg-primary/10 text-primary'; break;
                        case 'booked': pillColor = 'bg-surface-container-high text-primary'; break;
                      }

                      const start = new Date(apt.starts_at!);
                      const timeString = `${(start.getHours() % 12 || 12).toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;

                      return (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick(apt);
                          }}
                          className={`text-[0.6rem] px-1.5 py-1 rounded w-full truncate font-medium hover:brightness-95 cursor-pointer transition ${pillColor}`}
                        >
                          {timeString} • {apt.services?.name}
                        </div>
                      );
                    })}
                    {dayAppointments.length > 4 && (
                      <div className="text-[0.6rem] text-outline px-1.5 font-bold">
                        +{dayAppointments.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
