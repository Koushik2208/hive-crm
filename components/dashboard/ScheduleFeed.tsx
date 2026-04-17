import React from "react";

interface Appointment {
  id: string;
  time: string;
  ampm: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  status: string;
}

interface ScheduleFeedProps {
  schedule: Appointment[];
}

export const ScheduleFeed: React.FC<ScheduleFeedProps> = ({ schedule }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return "border-secondary bg-secondary/10 text-secondary";
      case 'confirmed':
        return "border-tertiary-fixed bg-surface-container-low text-slate-600";
      case 'booked':
        return "border-slate-200 bg-slate-50 text-slate-500";
      default:
        return "border-slate-200 bg-slate-50 text-slate-500";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-semibold tracking-tight text-primary">Today's Schedule</h3>
        <button className="text-secondary text-sm font-bold hover:underline">View Full Calendar</button>
      </div>
      <div className="space-y-4">
        {schedule.length > 0 ? (
          schedule.map((apt) => (
            <div
              key={apt.id}
              className={`bg-white p-5 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.02)] flex flex-wrap md:flex-nowrap items-center gap-6 hover:translate-x-1 transition-transform border-l-4 ${getStatusStyles(apt.status).split(' ')[0]}`}
            >
              <div className="w-16 text-center">
                <span className="block text-lg font-bold text-primary">{apt.time}</span>
                <span className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-tighter">{apt.ampm}</span>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-secondary font-bold text-sm">
                  {apt.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-primary">{apt.clientName}</h4>
                  <p className="text-sm text-slate-500">{apt.serviceName}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="hidden sm:block">
                  <p className="text-[0.6rem] text-slate-400 font-bold uppercase tracking-widest mb-1">Staff</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-tertiary-fixed flex items-center justify-center text-[10px] font-bold">
                      {apt.staffName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{apt.staffName}</span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyles(apt.status).split(' ').slice(1).join(' ')}`}>
                    {getStatusLabel(apt.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl border-2 border-dashed border-slate-100 text-center text-slate-400">
            No remaining appointments for today
          </div>
        )}
      </div>
    </section>
  );
};
