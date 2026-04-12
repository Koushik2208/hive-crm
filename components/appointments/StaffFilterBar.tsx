import React from 'react';
import { Plus } from 'lucide-react';
import { StaffProfileWithDetails } from '@/types';

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
      <div className="flex gap-3">
        {/* All Team Button */}
        {!disableAllTeam && (
          <button 
            onClick={() => onStaffSelect?.(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all shrink-0 ${
              activeStaffId === null ? 'bg-secondary text-white' : 'bg-white text-secondary border border-outline-variant hover:bg-surface-container'
            }`}
          >
            <span className="text-sm font-medium">All Team</span>
          </button>
        )}

        {/* Individual Staff Buttons */}
        {staffList.map((staff) => {
          const isActive = activeStaffId === staff.id;
          return (
            <button
              key={staff.id}
              onClick={() => onStaffSelect?.(staff.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shrink-0 ${
                isActive 
                  ? 'border-secondary bg-secondary/5 ring-1 ring-secondary' 
                  : 'border-outline-variant hover:bg-white bg-transparent'
              }`}
            >
              <div className="h-6 w-6 overflow-hidden rounded-full border border-white">
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
              <span className={`text-sm font-medium ${isActive ? 'text-secondary font-bold' : 'text-secondary group-hover:text-primary'}`}>
                {staff.users?.first_name}
              </span>
            </button>
          );
        })}

        {/* Add Staff Button */}
        <button className="p-2 rounded-full border border-dashed border-outline-variant hover:bg-surface-container transition-colors ml-2">
          <Plus size={16} className="text-outline" />
        </button>
      </div>
    </div>
  );
}
