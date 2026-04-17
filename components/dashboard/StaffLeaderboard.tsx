import React from "react";

interface StaffPerformance {
  id: string;
  name: string;
  appointments: number;
  revenue: number;
  initial: string;
}

interface StaffLeaderboardProps {
  performance: StaffPerformance[];
}

export const StaffLeaderboard: React.FC<StaffLeaderboardProps> = ({ performance }) => {
  return (
    <section className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(78,68,73,0.04)]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-primary">Staff Performance</h3>
        <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
              <th className="pb-4 font-bold">Staff Member</th>
              <th className="pb-4 font-bold">Appointments</th>
              <th className="pb-4 font-bold text-right">Revenue Cont.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {performance.map((staff) => (
              <tr key={staff.id}>
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d6c4a4] text-primary flex items-center justify-center font-bold text-xs uppercase">
                      {staff.initial}
                    </div>
                    <span className="font-semibold text-slate-800">{staff.name}</span>
                  </div>
                </td>
                <td className="py-5 text-sm font-medium text-slate-600">{staff.appointments}</td>
                <td className="py-5 text-right font-bold text-primary">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(staff.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
