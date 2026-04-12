'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Sparkles, Loader2 } from 'lucide-react';
import { useStaff } from '@/hooks/useStaff';
import { Button } from '@/components/ui/Button';
import StaffCard from '@/components/staff/StaffCard';
import StaffFilterBar from '@/components/staff/StaffFilterBar';

import PageContainer from '@/components/layout/PageContainer';

export default function StaffPage() {
    const [filters, setFilters] = useState({
        role: 'All Roles',
        status: 'Active',
        branch: 'The Sanctuary Main'
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const { data, isLoading, error } = useStaff({
        role: filters.role,
        is_active: filters.status === 'Active' ? true : filters.status === 'Inactive' ? false : undefined,
        // Add branch filtering logic if branch names can be mapped to IDs
    });

    const staffList = data?.data || [];

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <PageContainer scrollable={true} className="space-y-8">
            {/* Header Section */}
            <header className="flex justify-between items-end">
                <div>
                    <p className="text-[0.65rem] font-bold tracking-[0.15em] text-secondary uppercase mb-1">
                        Human Resources
                    </p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary">Staff</h1>
                </div>
                <Link href="/staff/new">
                    <Button variant="primary" className="px-8 py-3.5 rounded-xl font-bold tracking-tight ambient-shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                        <UserPlus size={20} />
                        Add Staff
                    </Button>
                </Link>
            </header>

            {/* Filters Section */}
            <section>
                <StaffFilterBar
                    role={filters.role}
                    status={filters.status}
                    branch={filters.branch}
                    viewMode={viewMode}
                    onFilterChange={handleFilterChange}
                    onViewModeChange={setViewMode}
                />
            </section>

            {/* Content Section */}
            <section className="flex-1">
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="animate-spin text-secondary" size={32} />
                    </div>
                ) : error ? (
                    <div className="h-64 flex flex-col items-center justify-center bg-red-50 rounded-3xl p-8 border border-red-100">
                        <p className="text-red-600 font-medium">Failed to load team members.</p>
                        <Button variant="ghost" className="mt-2 text-red-500" onClick={() => window.location.reload()}>
                            Try again
                        </Button>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1'
                        }`}>
                        {staffList.map((staff) => (
                            <StaffCard key={staff.id} staff={staff} />
                        ))}
                    </div>
                )}
            </section>

            {/* Hiring Section / Footer */}
            <footer className="mt-12 flex flex-col items-center justify-center py-20 bg-surface-container-low/30 rounded-[3rem] border-2 border-dashed border-outline-variant/20">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-tertiary-fixed mb-4 ambient-shadow">
                    <Sparkles size={32} />
                </div>
                <h4 className="text-xl font-bold text-primary mb-2">Looking to expand your team?</h4>
                <p className="text-on-surface-variant/60 max-w-sm text-center mb-8">
                    Maintain your sanctuary's high standards by adding only the finest talent to your salon rosters.
                </p>
                <Button variant="outline" className="text-primary font-bold text-sm bg-white px-8 py-3 rounded-xl ambient-shadow hover:bg-surface-bright transition-colors border border-outline-variant/10">
                    View Hiring Pipeline
                </Button>
            </footer>
        </PageContainer>
    );
}