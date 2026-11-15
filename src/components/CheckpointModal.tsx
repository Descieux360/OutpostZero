import React from 'react';
import { Flag, Zap, Droplets, Wind, Utensils, ArrowRight } from 'lucide-react';
import type { MissionState } from '../domain/types';

interface CheckpointModalProps {
  state: MissionState;
  onDismiss: () => void;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({ state, onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[var(--color-deck)] border-4 border-[var(--color-line)] rounded-3xl max-w-md w-full p-6 shadow-2xl text-center text-[var(--color-regolith)]">
        {/* Icon Header */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[var(--color-action)]/20 border border-[var(--color-action)]/40 text-[var(--color-action)] flex items-center justify-center shadow-lg">
          <Flag className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-white mb-1">
          10-Day Mission Checkpoint!
        </h2>
        <p className="text-xs font-bold text-[var(--color-dust)] mb-5">
          Great job commanding Outpost Zero through Day {state.day - 1}! Here is your current base telemetry summary.
        </p>

        {/* Resource Telemetry Summary Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy Reserves
            </div>
            <div className="text-xl font-black text-white">{state.resources.energy} <span className="text-xs font-semibold text-slate-400">kWh</span></div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" /> Water Supply
            </div>
            <div className="text-xl font-black text-white">{state.resources.water} <span className="text-xs font-semibold text-slate-400">L</span></div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" /> Oxygen Level
            </div>
            <div className="text-xl font-black text-white">{state.resources.oxygen} <span className="text-xs font-semibold text-slate-400">L</span></div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" /> Food Rations
            </div>
            <div className="text-xl font-black text-white">{state.resources.food} <span className="text-xs font-semibold text-slate-400">Rations</span></div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className="w-full py-3.5 bg-[var(--color-nominal)] text-white font-black rounded-xl btn-chunky text-base flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 transition shadow-lg"
        >
          <span>Resume 30-Day Mission</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};