import React from 'react';
import AppointmentCard from './AppointmentCard';
import { AppointmentWithDetails } from '@/types';

interface AppointmentCalendarWeekProps {
  appointments: AppointmentWithDetails[];
  activeDate: string; // The selected day driving the week window
  effectiveStaffId: string | null;
  onDayClick: (dateStr: string, scrollY?: string) => void;
  onAppointmentClick: (appointment: AppointmentWithDetails) => void;
}

export default function AppointmentCalendarWeek({
  appointments,
  activeDate,
  effectiveStaffId,
  onDayClick,
  onAppointmentClick
}: AppointmentCalendarWeekProps) {
  const [activeHighlightDay, setActiveHighlightDay] = React.useState<string | null>(null);

  // 09:00 AM (9) to 06:00 PM (18) = 10 slots
  const hours = Array.from({ length: 10 }, (_, i) => i + 9);

  const formatHourString = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const num = hour > 12 ? hour - 12 : hour;
    return `${num.toString().padStart(2, '0')}:00 ${ampm}`;
  };

  // Compute the 7 days of the week for the columns
  const baseDate = new Date(activeDate);
  const dayOfWeek = baseDate.getDay() || 7; // 1=Mon, 7=Sun
  baseDate.setDate(baseDate.getDate() - dayOfWeek + 1); // Monday

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return {
      dateObj: d,
      dateString: d.toLocaleDateString('en-CA'),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate()
    };
  });

  // Filter appointments for the target staff only
  const staffAppointments = appointments.filter(a => a.staff_id === effectiveStaffId);

  return (
    <section className="flex-1 px-8 min-h-0 flex flex-col w-full relative">
      <div className="bg-surface-container-low rounded-3xl overflow-hidden flex-1 border-t-0 min-h-0 flex flex-col">
        <div className="flex-1 w-full overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-outline-variant hover:scrollbar-thumb-secondary scrollbar-track-transparent relative">
          <div className="flex min-h-full min-w-full w-fit bg-surface">
            {/* Time Column - Sticky on X-axis */}
            <div className="w-20 shrink-0 bg-surface-container-low flex flex-col pt-12 pb-8 items-center border-r border-outline-variant/10 sticky left-0 z-40 shadow-sm">
              {hours.map((hour) => (
                <div key={hour} className="h-40 shrink-0 flex items-start justify-center">
                  <span className="text-[0.65rem] font-bold text-outline tracking-tighter uppercase relative -top-3">
                    {formatHourString(hour)}
                  </span>
                </div>
              ))}
            </div>

            {/* Master Grid Content Container */}
            <div className="flex-1 relative flex">
              {/* Background Horizontal Grid Lines */}
              <div className="absolute top-12 left-0 right-0 bottom-0 pointer-events-none z-0">
                {hours.map((hour) => (
                  <div key={`grid-${hour}`} className="h-40 shrink-0 border-t border-outline-variant/10" />
                ))}
              </div>

              {/* Day Columns */}
              {weekDays.map((day, index) => {
                // Get appointments for this specific day
                const dayAppointments = staffAppointments.filter((apt) => {
                  const aptDateObj = new Date(apt.starts_at!);
                  return aptDateObj.toLocaleDateString('en-CA') === day.dateString;
                });

                const isHighlighted = activeHighlightDay === day.dateString;

                return (
                  <div
                    key={day.dateString}
                    className={`flex-1 flex flex-col relative z-10 min-w-48 xl:min-w-64 transition-colors ${isHighlighted ? 'bg-surface-container-low/80' : 'hover:bg-surface-container-low/50'
                      } ${index !== 6 ? 'border-r border-outline-variant/40' : ''}`}
                  >
                    {/* Column Header */}
                    <div
                      onClick={() => setActiveHighlightDay(isHighlighted ? null : day.dateString)}
                      className={`sticky top-0 z-30 h-12 bg-surface/90 backdrop-blur-md border-b flex flex-col items-center justify-center cursor-pointer transition-colors group ${isHighlighted ? 'border-primary ring-1 ring-inset ring-primary/20 bg-primary/5' : 'border-surface-container hover:bg-surface-container-low'
                        }`}
                    >
                      <span className="text-[0.65rem] font-bold text-outline uppercase tracking-wider group-hover:text-primary">
                        {day.dayName}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {day.dayNumber}
                      </span>
                    </div>

                    {/* Column Body / Appointments */}
                    <div className="relative flex-1 w-full mt-0">
                      {dayAppointments.map((apt) => (
                        <AppointmentCard
                          key={apt.id}
                          appointment={apt}
                          onClick={() => onAppointmentClick(apt)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
