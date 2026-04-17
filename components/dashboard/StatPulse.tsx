import React from "react";

interface StatPulseProps {
  summary: {
    total: number;
    completed: number;
    cancelled: number;
    booked: number;
  };
  revenue: {
    today: number;
    currency: string;
  };
}

export const StatPulse: React.FC<StatPulseProps> = ({ summary, revenue }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Appointments */}
      <div className="bg-white p-6 rounded-xl shadow-ambient hover:shadow-lg transition-all group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined">event_note</span>
          </div>
          <span className="text-[0.65rem] font-bold text-slate-400 tracking-widest uppercase">Total Appointments</span>
        </div>
        <div className="text-3xl font-bold tracking-tighter text-primary">{summary.total}</div>
        <div className="mt-2 text-xs text-secondary font-medium">+12% from yesterday</div>
      </div>

      {/* Completed */}
      <div className="bg-white p-6 rounded-xl shadow-ambient hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
            <span className="material-symbols-outlined font-fill">check_circle</span>
          </div>
          <span className="text-[0.65rem] font-bold text-slate-400 tracking-widest uppercase">Completed</span>
        </div>
        <div className="text-3xl font-bold tracking-tighter text-primary">{summary.completed}</div>
        <div className="mt-2 text-xs text-slate-400 font-medium">75% daily target</div>
      </div>

      {/* Cancelled */}
      <div className="bg-white p-6 rounded-xl shadow-ambient hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <span className="material-symbols-outlined">cancel</span>
          </div>
          <span className="text-[0.65rem] font-bold text-slate-400 tracking-widest uppercase">Cancelled</span>
        </div>
        <div className="text-3xl font-bold tracking-tighter text-primary">{summary.cancelled}</div>
        <div className="mt-2 text-xs text-red-500 font-medium">-5% from avg</div>
      </div>

      {/* Revenue Today */}
      <div className="bg-primary p-6 rounded-xl shadow-lg group relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg text-white">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[0.65rem] font-bold text-white/50 tracking-widest uppercase">Revenue Today</span>
          </div>
          <div className="text-3xl font-bold tracking-tighter text-white">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: revenue.currency, maximumFractionDigits: 0 }).format(revenue.today)}
          </div>
          <div className="mt-2 text-xs text-tertiary-fixed font-medium">Top performing day</div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-8xl">trending_up</span>
        </div>
      </div>
    </section>
  );
};
