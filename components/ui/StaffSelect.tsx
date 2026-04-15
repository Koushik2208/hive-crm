"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';

export interface StaffSelectProps {
  label?: string;
  value: string; // The name or ID
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

/**
 * A thematic "Aura Velvet" select component for choosing staff.
 * Shows avatars/initials and names.
 */
export function StaffSelect({
  label,
  value,
  onChange,
  placeholder = "Select Stylist",
  error,
  className = '',
}: StaffSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: staffData, isLoading } = useStaff({ is_active: true });

  const staff = staffData?.data || [];
  const selectedStaff = staff.find(s => (s.users?.first_name || '') + ' ' + (s.users?.last_name || '') === value || s.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className={`relative group w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 ml-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full bg-surface-container-low border-0 
          ${error ? 'ring-1 ring-error' : 'focus:ring-2 focus:ring-secondary/20'}
          rounded-xl px-4 py-3 text-sm text-primary flex items-center justify-between
          transition-all duration-200 outline-none h-[48px]
        `}
      >
        <div className="flex items-center gap-3">
          {selectedStaff ? (
            <>
              <div className="w-6 h-6 rounded-full overflow-hidden bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary">
                {selectedStaff.users?.avatar_url ? (
                  <img src={selectedStaff.users.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(selectedStaff.users?.first_name || undefined, selectedStaff.users?.last_name || undefined)
                )}
              </div>
              <span>{selectedStaff.users?.first_name} {selectedStaff.users?.last_name}</span>
            </>
          ) : (
            <span className="text-on-surface-variant/40">{placeholder}</span>
          )}
        </div>
        {isLoading ? <Loader2 size={16} className="animate-spin opacity-40" /> : <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface-container-low rounded-2xl shadow-ambient border border-outline-variant/10 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {staff.length === 0 && !isLoading && (
              <div className="p-3 text-xs text-on-surface-variant/60 text-center italic">No staff available</div>
            )}
            {staff.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  // We store the name for now as per current data structure, or ID if we preferred
                  onChange(`${member.users?.first_name || ''} ${member.users?.last_name || ''}`);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                  {member.users?.avatar_url ? (
                    <img src={member.users.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(member.users?.first_name || undefined, member.users?.last_name || undefined)
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary">{member.users?.first_name} {member.users?.last_name}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{member.users?.role?.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-[10px] text-error mt-1 ml-1 font-medium animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
