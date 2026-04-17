import React from "react";

interface ClientGrowthProps {
  stats: {
    total: number;
    newThisMonth: number;
  };
}

export const ClientGrowth: React.FC<ClientGrowthProps> = ({ stats }) => {
  return (
    <section className="col-span-12 lg:col-span-4 grid gap-6">
      {/* Total Clients Card */}
      <div className="bg-secondary/10 p-8 rounded-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-[0.65rem] font-bold text-secondary tracking-widest uppercase mb-2">Total Clients</p>
          <h4 className="text-4xl font-extrabold text-primary tracking-tighter">{stats.total.toLocaleString()}</h4>
          <div className="mt-4 flex items-center gap-2 text-secondary font-bold text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+5.2% grow rate</span>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 text-secondary/5 opacity-50 group-hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined text-9xl">groups</span>
        </div>
      </div>

      {/* New This Month Card */}
      <div className="bg-tertiary-fixed p-8 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] font-bold text-on-tertiary-fixed/60 tracking-widest uppercase mb-1">New this month</p>
          <h4 className="text-3xl font-extrabold text-on-tertiary-fixed">{stats.newThisMonth}</h4>
        </div>
        <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl">person_add</span>
        </div>
      </div>
    </section>
  );
};
