import React from 'react';
import { Clock, User } from 'lucide-react';
import { AppointmentWithDetails } from '@/types';

interface AppointmentCardProps {
  appointment: AppointmentWithDetails;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export default function AppointmentCard({ appointment, onClick, onMouseEnter }: AppointmentCardProps) {
  // Calculate relative top position and height strictly
  // Our grid starts at 09:00 AM relative to the container.
  // 1 hour = 96px. Thus, (total minutes since 9AM) * (96/60)
  const start = new Date(appointment.starts_at!);
  const startHour = start.getHours();
  const startMinutes = start.getMinutes();

  // If before 9AM or after 18PM (6PM) outside grid, clamp it or let it run.
  const minutesSince9AM = (startHour - 9) * 60 + startMinutes;
  const pixelsPerMinute = 160 / 60;

  // The column header natively provides our 48px top offset now, 
  // so top=0 correctly corresponds to 09:00 AM visually against the grid lines.
  const topPosition = minutesSince9AM * pixelsPerMinute;
  const height = (appointment.services?.duration_mins || 60) * pixelsPerMinute;

  // Derive styles based on status
  let borderClass = 'border-primary';
  let badgeClass = 'bg-surface-container-low text-outline';

  switch (appointment.status) {
    case 'confirmed':
      borderClass = `border-secondary`;
      badgeClass = `bg-tertiary-fixed text-on-tertiary-fixed`;
      break;
    case 'in_progress':
      borderClass = `border-primary`;
      badgeClass = `bg-secondary/20 text-primary`;
      break;
    case 'booked':
      borderClass = `border-tertiary-fixed`;
      badgeClass = `bg-surface-container-low text-primary`;
      break;
  }

  // Deterministic time formatter — avoids toLocaleTimeString() which produces
  // different AM/PM casing between Node.js (server) and browser (client), 
  // causing React hydration mismatches.
  const formatTime = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onMouseEnter={onMouseEnter}
      onMouseMove={(e) => e.stopPropagation()}
      className={`absolute shadow-ambient rounded-2xl bg-white p-4 border-l-4 ${borderClass} group hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden z-10`}
      style={{
        top: `${Math.max(0, topPosition)}px`,
        height: `${height}px`,
        // We now safely bound the card tightly to the flex column walls using 2% margins for breathing room
        left: '2%',
        right: '4%',
      }}
    >
      <div className="flex justify-between items-start mb-1 gap-2">
        <div className="overflow-hidden pr-2">
          <h4 className="text-sm font-bold text-primary truncate">
            {appointment.clients?.first_name} {appointment.clients?.last_name}
          </h4>
          <p className="text-[0.65rem] text-secondary font-medium uppercase tracking-wider truncate">
            {appointment.services?.name}
          </p>
        </div>
        <div className={`text-[0.6rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${badgeClass}`}>
          {appointment.status?.replace('_', ' ')}
        </div>
      </div>

      {/* Hide details structurally if duration is too small (< 45mins) */}
      {height >= 72 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          <div className="flex items-center gap-1 text-[0.65rem] text-outline font-medium">
            <Clock size={14} />
            {appointment.starts_at && formatTime(appointment.starts_at)} ({appointment.services?.duration_mins} min)
          </div>
          <div className="flex items-center gap-1 text-[0.65rem] text-outline font-medium">
            <User size={14} />
            {appointment.staff_profiles?.users?.first_name}
          </div>
        </div>
      )}
    </div>
  );
}

