import React, { useEffect, useRef, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { AppointmentWithDetails, StaffProfileWithDetails } from '@/types';
import { useSearchParams } from 'next/navigation';

interface AppointmentCalendarDayProps {
  appointments: AppointmentWithDetails[];
  staffList: StaffProfileWithDetails[];
  isSyncing?: boolean;
  onCellClick: (staffId: string, time: string) => void;
  onAppointmentClick: (appointment: AppointmentWithDetails) => void;
}

export default function AppointmentCalendarDay({
  appointments,
  staffList,
  isSyncing = false,
  onCellClick,
  onAppointmentClick
}: AppointmentCalendarDayProps) {
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeHighlightStaff, setActiveHighlightStaff] = useState<string | null>(null);

  // Layout Constants
  const GRID_TOP_OFFSET = 128; // 128px (pt-32) gives 48px buffer after 80px (h-20) header
  const pixelsPerMinute = 160 / 60;
  const intervalPixels = pixelsPerMinute * 10;

  // Hover & Selection State
  const [hoverInfo, setHoverInfo] = useState<{
    y: number;
    time: string;
    time24: string;
    staffId: string;
  } | null>(null);

  // Dynamic Live Time Tracking
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getLiveY = () => {
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // We only show if within our 9AM-18PM grid
    if (hours < 9 || hours >= 18) return null;

    const minutesSince9AM = (hours - 9) * 60 + minutes;
    return (minutesSince9AM * pixelsPerMinute) + GRID_TOP_OFFSET;
  };

  const liveY = getLiveY();

  // Auto-scroll logic when drill-down occurs from Month/Week view
  useEffect(() => {
    const scrollVal = searchParams.get('scroll');
    if (scrollVal && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(scrollVal);
    }
  }, [searchParams]);

  // 09:00 AM (9) to 06:00 PM (18) = 10 slots
  const hours = Array.from({ length: 10 }, (_, i) => i + 9);

  const formatHourString = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const num = hour > 12 ? hour - 12 : hour;
    return `${num.toString().padStart(2, '0')}:00 ${ampm}`;
  };

  const handleMouseMove = (e: React.MouseEvent, staffId: string) => {
    if (!gridRef.current) return;

    // Get mouse Y relative to the entire scrollable grid container
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Calculate Y relative to the grid start (minus header/buffer)
    const yRelative = y - GRID_TOP_OFFSET;

    // Ignore if mouse is above the grid (in header area)
    if (yRelative < -10) {
      setHoverInfo(null);
      return;
    }

    // Snap to nearest 10-minute interval relative to 09:00 AM
    const snappedY = Math.round(yRelative / intervalPixels) * intervalPixels;

    // Calculate time based on snapped pixels
    const totalMinutes = Math.round(snappedY / pixelsPerMinute);
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minutes = Math.max(0, totalMinutes % 60);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const timeString = `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    const time24 = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    setHoverInfo({
      y: snappedY,
      time: timeString,
      time24,
      staffId
    });
  };

  return (
    <section className="flex-1 px-8 min-h-0 flex flex-col w-full relative">
      <div className="bg-surface-container-low rounded-3xl overflow-hidden flex-1 border-t-0 min-h-0 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 w-full overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-outline-variant hover:scrollbar-thumb-secondary scrollbar-track-transparent relative"
          onMouseLeave={() => setHoverInfo(null)}
        >
          <div ref={gridRef} className="flex min-h-full min-w-full w-fit bg-surface relative">
            {/* Time Column - Sticky on X-axis */}
            <div className="w-20 shrink-0 bg-surface-container-low flex flex-col pt-32 pb-8 items-center border-r border-outline-variant/10 sticky left-0 z-40 shadow-sm">
              {hours.map((hour) => (
                <div key={hour} className="h-40 shrink-0 flex items-start justify-center">
                  <span className="text-[0.65rem] font-bold text-outline tracking-tighter uppercase relative -top-3">
                    {formatHourString(hour)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Precision Hover Indicator Line - Spans Full Width across entire grid */}
            {hoverInfo && (
                <div
                  className="absolute left-0 right-0 z-50 pointer-events-none flex items-center"
                  style={{ top: `${hoverInfo.y + GRID_TOP_OFFSET - 1}px` }}
                >
                  <div className="w-20 shrink-0 flex justify-center sticky left-0 z-50 pointer-events-auto">
                    <div className="bg-secondary text-white text-[0.65rem] font-bold px-2 py-0.5 rounded shadow-lg border border-white/20 whitespace-nowrap">
                      {hoverInfo.time}
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-secondary/40 border-b border-dashed border-secondary/30" />
                </div>
              )}

            {/* Master Grid Content Container */}
            <div className={`flex-1 relative flex transition-opacity duration-300 ${isSyncing ? 'opacity-60 grayscale-[0.2]' : 'opacity-100'}`}>
              {/* Background Horizontal Grid Lines - Absolute behind columns */}
              <div className="absolute top-32 left-0 right-0 bottom-0 pointer-events-none z-0">
                {hours.map((hour) => (
                  <div key={`grid-${hour}`} className="h-40 shrink-0 border-t border-outline-variant/10" />
                ))}
              </div>

              {/* Staff Columns */}
              {staffList.map((staff, index) => {
                const isHighlighted = activeHighlightStaff === staff.id;

                return (
                  <div
                    key={staff.id}
                    onMouseMove={(e) => handleMouseMove(e, staff.id)}
                    onClick={(e) => {
                      if (hoverInfo) {
                        onCellClick(hoverInfo.staffId, hoverInfo.time24);
                        setHoverInfo(null);
                      }
                    }}
                    className={`flex-1 flex flex-col relative z-10 min-w-72 transition-colors ${isHighlighted ? 'bg-surface-container-low/80' : 'hover:bg-surface-container-low/50'
                      } ${index !== staffList.length - 1 ? 'border-r border-outline-variant/40' : ''}`}
                  >
                    {/* Column Header */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening drawer when clicking header
                        setActiveHighlightStaff(isHighlighted ? null : staff.id);
                      }}
                      className={`sticky top-0 z-30 h-20 bg-surface/90 backdrop-blur-md border-b flex items-center justify-center gap-2 cursor-pointer transition-colors group ${isHighlighted ? 'border-primary ring-1 ring-inset ring-primary/20 bg-primary/5' : 'border-outline-variant/10 hover:bg-surface-container-low'
                        }`}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: staff.color_hex || '#ccc' }}
                      />
                      <span className="text-xs font-bold text-primary group-hover:opacity-80 transition-opacity">
                        {staff.users?.first_name}
                      </span>
                    </div>

                    {/* Column Body / Appointments */}
                    <div className="relative flex-1 w-full mt-0">
                      {appointments
                        .filter((apt) => apt.staff_id === staff.id)
                        .map((apt) => (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            onMouseEnter={() => setHoverInfo(null)}
                            onClick={() => {
                              setHoverInfo(null);
                              onAppointmentClick(apt);
                            }}
                          />
                        ))}
                    </div>
                  </div>
                );
              })}

              {/* Precision Hover Indicator Line */}

              {/* Simulated Timeline Marker (LIVE) spans entire Grid Width */}
              {liveY && (
                <div
                  className="absolute left-0 right-0 z-40 pointer-events-none"
                  style={{ top: `${liveY}px` }}
                >
                  <div className="flex items-center gap-2 -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-sm ml-[-6px]" />
                    <div className="flex-1 h-[2px] bg-red-600/30" />
                    <span className="bg-red-600 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full mr-2 tracking-wider">
                      LIVE
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
