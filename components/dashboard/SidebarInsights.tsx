import React from "react";

interface ServiceInsight {
  name: string;
  count: number;
  percentage: number;
}

interface SidebarInsightsProps {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    currency: string;
  };
  topServices: ServiceInsight[];
}

export const SidebarInsights: React.FC<SidebarInsightsProps> = ({ revenue, topServices }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: revenue.currency, notation: 'compact', maximumFractionDigits: 1 }).format(val);
  };

  return (
    <aside className="space-y-8">
      {/* Revenue Summary */}
      <div className="bg-surface-container-low p-8 rounded-2xl">
        <h3 className="text-lg font-bold text-primary mb-6">Revenue Summary</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-widest">Today</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(revenue.today)}</p>
            </div>
            {/* Visual Bar Graph */}
            <div className="w-24 h-10 flex items-end gap-1">
              <div className="w-full bg-primary/10 h-1/2 rounded-sm"></div>
              <div className="w-full bg-primary/20 h-2/3 rounded-sm"></div>
              <div className="w-full bg-primary/40 h-3/4 rounded-sm"></div>
              <div className="w-full bg-primary h-full rounded-sm"></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div>
              <p className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-widest">This Week</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(revenue.thisWeek)}</p>
            </div>
            <span className="text-secondary text-xs font-bold bg-secondary/10 px-2 py-1 rounded">+14%</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div>
              <p className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-widest">This Month</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(revenue.thisMonth)}</p>
            </div>
            <span className="text-secondary text-xs font-bold bg-secondary/10 px-2 py-1 rounded">+28%</span>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(78,68,73,0.04)]">
        <h3 className="text-lg font-bold text-primary mb-6">Top Services</h3>
        <div className="space-y-5">
          {topServices.map((service, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{service.name}</span>
                <span className="font-bold">{service.count}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : 'bg-tertiary-fixed'}`}
                  style={{ width: `${Math.min(100, (service.count / (topServices[0]?.count || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
