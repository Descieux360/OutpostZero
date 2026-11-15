import React from 'react';
import { Zap, Wind, Droplets, Utensils, ShieldCheck, ShieldAlert, Award } from 'lucide-react';
import type { MissionState, MissionConfig } from '../domain/types';

interface ResourceHeaderProps {
  state: MissionState;
  config: MissionConfig;
}

export const ResourceHeader: React.FC<ResourceHeaderProps> = ({ state, config }) => {
  const getResourceMax = (id: string) => {
    return config.resources.find((r) => r.id === id)?.max || 200;
  };

  const getResourceWarn = (id: string) => {
    return config.resources.find((r) => r.id === id)?.warnBelow || 30;
  };

  const getPercentage = (val: number, max: number) => Math.min(100, Math.max(0, Math.round((val / max) * 100)));

  const renderMetricCard = (
    label: string,
    val: number,
    id: string,
    unit: string,
    icon: React.ReactNode,
    barColor: string
  ) => {
    const max = getResourceMax(id);
    const warn = getResourceWarn(id);
    const pct = getPercentage(val, max);
    const isWarning = val < warn;
    const isCritical = val <= 0;

    return (
      <div
        className={`p-3.5 rounded-2xl border-2 transition-all ${
          isCritical
            ? 'bg-red-950/60 border-red-500 animate-pulse'
            : isWarning
            ? 'bg-amber-950/40 border-amber-500'
            : 'bg-slate-900/80 border-slate-700/80'
        }`}
      >
        <div className="flex justify-between items-center text-xs font-black mb-1">
          <span className="flex items-center gap-1.5 text-slate-300">
            {icon}
            <span>{label}</span>
          </span>
          <span className={`font-mono text-sm font-black ${isWarning ? 'text-amber-400' : 'text-white'}`}>
            {val} <span className="text-[10px] font-semibold text-slate-400">/ {max} {unit}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/60">
          <div
            className={`resource-bar-fill h-full rounded-full ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[var(--color-deck)] border-2 border-[var(--color-line)] rounded-3xl p-4 shadow-xl space-y-3 text-[var(--color-regolith)]">
      {/* Top Title & Shielding Status Row */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-wider uppercase text-[var(--color-dust)]">
            OUTPOST TELEMETRY
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Science Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/40 text-sky-300 text-xs font-black">
            <Award className="w-4 h-4 text-sky-400" />
            <span>Science Score: {state.scienceScore || 0} pts</span>
          </div>

          {/* Radiation Shield Status Pill */}
          {state.radiation === 'protected' ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Radiation Shielding: PROTECTED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-black">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Radiation Shielding: NOMINAL</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Core Resource Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {renderMetricCard(
          'Energy',
          state.resources.energy,
          'energy',
          'kWh',
          <Zap className="w-4 h-4 text-amber-400" />,
          'bg-amber-400'
        )}

        {renderMetricCard(
          'Oxygen',
          state.resources.oxygen,
          'oxygen',
          'L',
          <Wind className="w-4 h-4 text-sky-400" />,
          'bg-sky-400'
        )}

        {renderMetricCard(
          'Water',
          state.resources.water,
          'water',
          'L',
          <Droplets className="w-4 h-4 text-blue-400" />,
          'bg-blue-400'
        )}

        {renderMetricCard(
          'Food',
          state.resources.food,
          'food',
          'Rations',
          <Utensils className="w-4 h-4 text-emerald-400" />,
          'bg-emerald-400'
        )}
      </div>
    </div>
  );
};