import React from 'react';
import { Plus } from 'lucide-react';
import { StaffProfileWithDetails } from '@/types';
import { FilterPill } from '@/components/ui/FilterPill';

interface StaffFilterBarProps {
  staffList: StaffProfileWithDetails[];
  activeStaffId?: string | null;  // null means "All Team" (default for Day view)
  onStaffSelect?: (staffId: string | null) => void;
  disableAllTeam?: boolean; // Used for week/month view where "All Team" makes no sense
}

export default function StaffFilterBar({
  staffList,
  activeStaffId = null,
  onStaffSelect,
  disableAllTeam = false
}: StaffFilterBarProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <span className="text-xs font-bold text-outline tracking-widest uppercase shrink-0">
        Filter Staff
      </span>
      <div className="flex gap-3 py-2 items-center">
        {/* All Team Button */}
        {!disableAllTeam && (
          <FilterPill
            label="All Team"
            isActive={activeStaffId === null}
            onClick={() => onStaffSelect?.(null)}
            className="shrink-0"
          />
        )}

        {/* Individual Staff Buttons */}
        {staffList.map((staff) => {
          const isActive = activeStaffId === staff.id;
          
          // Prepare the icon (avatar or color dot)
          const icon = (
            <div className="h-6 w-6 overflow-hidden rounded-full border border-white/20">
              {staff.users?.avatar_url ? (
                <img
                  src={staff.users.avatar_url}
                  alt={staff.users.first_name || 'Staff'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: staff.color_hex || '#ccc' }}
                />
              )}
            </div>
          );

          return (
            <FilterPill
              key={staff.id}
              label={staff.users?.first_name || 'Staff'}
              isActive={isActive}
              onClick={() => onStaffSelect?.(staff.id)}
              icon={icon}
              className="shrink-0"
            />
          );
        })}

        {/* Add Staff Button - kept as is as it's a specific action placeholder */}
        <button className="p-2 rounded-full border border-dashed border-outline-variant hover:bg-surface-container transition-colors ml-2 active:scale-90">
          <Plus size={16} className="text-outline" />
        </button>
      </div>
    </div>
  );
}
