"use client";

import { useQuery } from "@tanstack/react-query";
import { StatPulse } from "@/components/dashboard/StatPulse";
import { ScheduleFeed } from "@/components/dashboard/ScheduleFeed";
import { SidebarInsights } from "@/components/dashboard/SidebarInsights";
import { StaffLeaderboard } from "@/components/dashboard/StaffLeaderboard";
import { ClientGrowth } from "@/components/dashboard/ClientGrowth";
import { Loader2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

export default function DashboardPage() {
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await fetch("/api/v1/dashboard");
            if (!res.ok) throw new Error("Failed to fetch dashboard data");
            const json = await res.json();
            return json.data;
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-surface">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                    <p className="text-sm font-medium text-slate-400 animate-pulse">Synchronizing your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="flex-1 flex items-center justify-center bg-surface">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
                    <h2 className="text-lg font-bold text-red-600 mb-2">Sync Error</h2>
                    <p className="text-slate-500 mb-4">We couldn't load your business insights right now.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PageContainer>
            <div className="flex flex-col gap-10">
                {/* Section 1: Top Metrics */}
                <StatPulse
                    summary={dashboardData.summary}
                    revenue={dashboardData.revenue}
                />

                {/* Main Grid: Schedule + Sidebar */}
                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Left Column: Schedule (8/12) */}
                    <div className="col-span-12 lg:col-span-8">
                        <ScheduleFeed schedule={dashboardData.schedule} />
                    </div>

                    {/* Right Column: Insights (4/12) */}
                    <div className="col-span-12 lg:col-span-4">
                        <SidebarInsights
                            revenue={dashboardData.revenue}
                            topServices={dashboardData.topServices}
                        />
                    </div>
                </div>

                {/* Bottom Row: Staff + Clients */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Staff Leaderboard (8/12) */}
                    <div className="col-span-12 lg:col-span-8">
                        <StaffLeaderboard performance={dashboardData.staffPerformance} />
                    </div>

                    {/* Client Metrics (4/12) */}
                    <div className="col-span-12 lg:col-span-4">
                        <ClientGrowth stats={dashboardData.clientStats} />
                    </div>
                </div>
            </div>
        </PageContainer>


    );
}
