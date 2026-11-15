import React from 'react';
import { Flag, Sun, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

export interface MissionTimelineProps {
  currentDay: number;
  totalDays: number;
  scriptedDays?: number[];
  checkpointDays?: number[];
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({
  currentDay,
  totalDays = 30,
}) => {
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const getEventBadge = (day: number) => {
    if (day === 4) {
      return (
        <span className="text-[10px] text-amber-400 flex items-center justify-center gap-0.5 font-black">
          <AlertTriangle className="w-3 h-3" /> Fault
        </span>
      );
    }
    if (day === 12 || day === 22) {
      return (
        <span className="text-[10px] text-orange-400 flex items-center justify-center gap-0.5 font-black">
          <Sun className="w-3 h-3 text-amber-400" /> Storm
        </span>
      );
    }
    if (day === 10 || day === 20 || day === 30) {
      return (
        <span className="text-[10px] text-sky-400 flex items-center justify-center gap-0.5 font-black">
          <Flag className="w-3 h-3 text-sky-400" /> Flag
        </span>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[var(--color-deck)] border-2 border-[var(--color-line)] rounded-3xl p-5 shadow-xl text-[var(--color-regolith)] space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>📅 30-Day Mission Log Calendar</span>
          </h2>
          <p className="text-xs font-semibold text-[var(--color-dust)]">
            Click Advance Day to progress turn by turn through the 30-day lunar surface schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-extrabold text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-action)]" /> Current Day
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Locked
          </span>
        </div>
      </div>

      {/* FULL-SIZE 30-DAY CARD GRID (6 Cols x 5 Rows) */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
        {daysArray.map((dayNum) => {
          const isPast = dayNum < currentDay;
          const isCurrent = dayNum === currentDay;
          const eventBadge = getEventBadge(dayNum);

          return (
            <div
              key={dayNum}
              className={`relative flex flex-col justify-between p-2.5 rounded-xl border-2 transition-all min-h-[64px] ${
                isCurrent
                  ? 'bg-[var(--color-action)]/20 border-[var(--color-action)] ring-2 ring-[var(--color-action)]/50 scale-[1.03] z-10 shadow-lg'
                  : isPast
                  ? 'bg-slate-900/90 border-slate-700/80 text-slate-300'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-60'
              }`}
            >
              {/* Day Header Row */}
              <div className="flex justify-between items-center">
                <span className={`text-xs font-black ${isCurrent ? 'text-[var(--color-action)]' : isPast ? 'text-white' : 'text-slate-500'}`}>
                  Day {dayNum}
                </span>

                {isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-action)] animate-ping" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
              </div>

              {/* Event Badge / Status Marker */}
              <div className="mt-1 flex items-center justify-center min-h-[16px]">
                {eventBadge ? (
                  eventBadge
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500">
                    {isCurrent ? 'Active' : isPast ? 'Passed' : ''}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};