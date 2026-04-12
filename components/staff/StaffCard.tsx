import React from 'react';
import Link from 'next/link';
import { MoreVertical, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { StaffProfileWithDetails } from '@/types';

interface StaffCardProps {
    staff: StaffProfileWithDetails;
}

export default function StaffCard({ staff }: StaffCardProps) {
    const { users } = staff;
    const isActive = users?.is_active;

    return (
        <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-outline-variant/5 group hover:bg-surface-bright transition-all duration-300 flex flex-col relative overflow-hidden">
            {/* Top Action Menu */}
            <div className="absolute top-0 right-0 p-4">
                <button className="p-1.5 text-on-surface-variant/40 hover:text-primary transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-surface-container-low group-hover:ring-tertiary-fixed transition-all duration-500 shadow-inner">
                    {users?.avatar_url ? (
                        <img
                            src={users.avatar_url}
                            alt={`${users.first_name}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
                            style={{ backgroundColor: staff.color_hex || '#32172a' }}
                        >
                            {users?.first_name?.[0]}{users?.last_name?.[0]}
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-bold text-primary tracking-tight">
                    {users?.first_name} {users?.last_name}
                </h3>
                <p className="text-secondary font-medium text-sm">
                    {users?.role?.replace('_', ' ')}
                </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-tertiary-fixed-dim" />
                    <span className="text-sm text-on-surface-variant/80">Main Sanctuary</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail size={18} className="text-tertiary-fixed-dim" />
                    <span className="text-sm text-on-surface-variant/80 truncate">{users?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone size={18} className="text-tertiary-fixed-dim" />
                    <span className="text-sm text-on-surface-variant/80">{users?.phone || '+1 (555) 000-0000'}</span>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex justify-between items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isActive 
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed' 
                        : 'bg-surface-variant text-on-surface-variant'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        isActive ? 'bg-on-tertiary-fixed' : 'bg-on-surface-variant'
                    }`}></span>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
                
                <Link href={`/staff/${staff.id}/edit`}>
                    <button className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline transition-all group/btn">
                        View Profile
                        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

