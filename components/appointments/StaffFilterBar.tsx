import React from 'react';
import { Plus } from 'lucide-react';
import { Staff } from '@/lib/mockData';

interface StaffFilterBarProps {
  staffList: Staff[];
}

export default function StaffFilterBar({ staffList }: StaffFilterBarProps) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <span className="text-xs font-bold text-outline tracking-widest uppercase shrink-0">
        Filter Staff
      </span>
      <div className="flex gap-3">
        {/* All Team Button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-white shadow-md transition-all shrink-0">
          <span className="text-sm font-medium">All Team</span>
        </button>

        {/* Individual Staff Buttons */}
        {staffList.map((staff) => (
          <button
            key={staff.id}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant hover:bg-white transition-all shrink-0"
          >
            <div className="h-6 w-6 overflow-hidden rounded-full border border-white">
              {staff.avatar_url ? (
                <img
                  src={staff.avatar_url}
                  alt={staff.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: staff.color_hex }}
                />
              )}
            </div>
            <span className="text-sm font-medium text-secondary group-hover:text-primary">
              {staff.name}
            </span>
          </button>
        ))}

        {/* Add Staff Button */}
        <button className="p-2 rounded-full border border-dashed border-outline-variant hover:bg-surface-container transition-colors">
          <Plus size={16} className="text-outline" />
        </button>
      </div>
    </div>
  );
}
