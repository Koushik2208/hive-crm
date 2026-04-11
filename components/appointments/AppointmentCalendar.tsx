import React from 'react';
import AppointmentCard from './AppointmentCard';
import { Appointment, Staff } from '@/lib/mockData';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  staffList: Staff[];
}

export default function AppointmentCalendar({ appointments, staffList }: AppointmentCalendarProps) {
  // 09:00 AM (9) to 06:00 PM (18) = 10 slots
  const hours = Array.from({ length: 10 }, (_, i) => i + 9);

  const formatHourString = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const num = hour > 12 ? hour - 12 : hour;
    return `${num.toString().padStart(2, '0')}:00 ${ampm}`;
  };

  return (
    <section className="flex-1 px-8 pb-8 min-h-0 flex flex-col w-full relative">
      <div className="bg-surface-container-low rounded-3xl overflow-hidden flex-1 border-t-0 min-h-0 flex flex-col">
        <div className="flex flex-1 w-full overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-outline-variant hover:scrollbar-thumb-secondary scrollbar-track-transparent relative">
          
          {/* Time Column */}
          <div className="w-20 shrink-0 bg-surface-container-low flex flex-col pt-12 pb-8 items-center border-r border-outline-variant/10 z-20">
            {hours.map((hour) => (
              <div key={hour} className="h-40 shrink-0 flex items-start justify-center">
                <span className="text-[0.65rem] font-bold text-outline tracking-tighter uppercase relative -top-3">
                  {formatHourString(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Master Grid Content Container */}
          <div className="flex-1 bg-surface relative flex">
            {/* Background Horizontal Grid Lines - Absolute behind columns */}
            <div className="absolute top-12 left-0 right-0 bottom-0 pointer-events-none z-0">
              {hours.map((hour) => (
                <div key={`grid-${hour}`} className="h-40 shrink-0 border-t border-outline-variant/10" />
              ))}
            </div>

            {/* Staff Columns */}
            {staffList.map((staff, index) => (
              <div 
                key={staff.id} 
                className={`flex-1 flex flex-col relative z-10 ${index !== staffList.length - 1 ? 'border-r border-outline-variant/10' : ''}`}
              >
                {/* Column Header */}
                <div className="sticky top-0 z-30 h-12 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: staff.color_hex }} 
                  />
                  <span className="text-xs font-bold text-primary">{staff.name}</span>
                </div>

                {/* Column Body / Appointments */}
                <div className="relative flex-1 w-full mt-0">
                  {appointments
                    .filter((apt) => apt.staff.id === staff.id)
                    .map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                  ))}
                </div>
              </div>
            ))}

            {/* Simulated Timeline Marker (LIVE) spans entire Grid Width */}
            <div
              className="absolute left-0 right-0 z-40 pointer-events-none"
              style={{ top: '808px' }}
            >
              <div className="flex items-center gap-2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-sm ml-[-6px]" />
                <div className="flex-1 h-[2px] bg-red-600/30" />
                <span className="bg-red-600 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full mr-2 tracking-wider">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
