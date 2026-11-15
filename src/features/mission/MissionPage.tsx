import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, Home, Sprout, Users, Compass, Radio, ArrowRight, RotateCcw } from 'lucide-react';
import { useMission } from './MissionContext';
import { ResourceHeader } from '../../components/ResourceHeader';
import { OutpostBaseView } from '../../components/OutpostBaseView';
import { BuildingPanel } from '../../components/BuildingPanel';
import { IncidentModal } from '../../components/IncidentModal';
import { MissionTimeline } from '../../components/MissionTimeline';
import { CheckpointModal } from '../../components/CheckpointModal';
import { getEventForDay } from '../../domain/events';

export const MissionPage: React.FC = () => {
  const { state, config, dispatch } = useMission();
  const navigate = useNavigate();
  const [selectedObjectId, setSelectedObjectId] = useState<string>('habitat');
  const [lastDismissedCheckpointDay, setLastDismissedCheckpointDay] = useState<number>(0);

  const activeIncident = state.pendingEventId ? getEventForDay(state.day, state) : null;
  const showCheckpoint =
    (state.day === 11 || state.day === 21) &&
    lastDismissedCheckpointDay !== state.day;

  const handleDismissCheckpoint = () => {
    setLastDismissedCheckpointDay(state.day);
  };

  if (state.missionStatus === 'completed') {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <section className="rounded-3xl border border-emerald-700 bg-slate-900 p-8 text-center">
          <div className="text-5xl">🌕</div>
          <p className="mt-4 text-sm font-black uppercase tracking-widest text-emerald-300">Lunar Mission Completed</p>
          <h1 className="mt-2 text-3xl font-black text-white">Great job, crew!</h1>
          <p className="mt-4 text-slate-300">You successfully commanded the outpost for {config.totalDays} simulated days. Take the lunar exam to complete your mission badge.</p>
          <button onClick={() => navigate('/exam/moon')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-black text-slate-950">Take Lunar Exam <ArrowRight size={18} /></button>
        </section>
      </main>
    );
  }

  if (state.missionStatus === 'failed') {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <section className="rounded-3xl border border-rose-700 bg-slate-900 p-8 text-center">
          <div className="text-5xl">🛠️</div>
          <p className="mt-4 text-sm font-black uppercase tracking-widest text-rose-300">Mission Aborted</p>
          <h1 className="mt-2 text-3xl font-black text-white">A Vital Resource Was Depleted</h1>
          <p className="mt-4 text-slate-300">Review your past log decisions and try again by balancing your crew survival needs more carefully.</p>
          <button onClick={() => { dispatch({ type: 'RESTART' }); navigate('/briefing') }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-black text-white"><RotateCcw size={18} /> Restart Mission</button>
        </section>
      </main>
    );
  }

  return (
    <div className="space-bg-animated min-h-screen bg-[var(--color-vacuum)] text-[var(--color-regolith)] p-4 sm:p-6 space-y-6">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 bg-[var(--color-deck)] p-4 rounded-3xl border-2 border-[var(--color-line)] shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white">{config.name}</h1>
          <div className="text-xs font-bold text-[var(--color-dust)]">
            Seed: <span className="font-mono text-amber-400">{state.seed}</span> | Daily Actions Remaining: <span className="text-emerald-400">{state.actionsLeft}</span>
          </div>
        </div>
      </div>

      {/* 1. GENERAL METRICS STRIP */}
      <div className="max-w-7xl mx-auto">
        <ResourceHeader state={state} config={config} />
      </div>

      {/* 2. FULL 30-DAY CALENDAR LOG GRID */}
      <div className="max-w-7xl mx-auto">
        <MissionTimeline currentDay={state.day} totalDays={config.totalDays} />
      </div>

      {/* 3. SIDE-BY-SIDE MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Realistic Isometric Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <OutpostBaseView
            systemModes={state.systemModes}
            crewCondition={state.crewCondition}
            selectedSystemId={selectedObjectId}
            pendingEventSystemId={activeIncident?.affectedSystemId}
            onSelectObject={(id) => setSelectedObjectId(id)}
          />

          {/* Quick-Select Installation Bar */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button
              onClick={() => setSelectedObjectId('solar')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition ${
                selectedObjectId === 'solar'
                  ? 'bg-[var(--color-action)] text-white border-transparent'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Solar Power Plant
            </button>

            <button
              onClick={() => setSelectedObjectId('habitat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition ${
                selectedObjectId === 'habitat'
                  ? 'bg-[var(--color-action)] text-white border-transparent'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-sky-400" /> Habitat Pod
            </button>

            <button
              onClick={() => setSelectedObjectId('greenhouse')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition ${
                selectedObjectId === 'greenhouse'
                  ? 'bg-[var(--color-action)] text-white border-transparent'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" /> Greenhouse
            </button>

            <button
              onClick={() => setSelectedObjectId('crew')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition ${
                selectedObjectId === 'crew'
                  ? 'bg-[var(--color-action)] text-white border-transparent'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-orange-400" /> Crew
            </button>

            <button
              onClick={() => setSelectedObjectId('rover')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition ${
                selectedObjectId === 'rover'
                  ? 'bg-[var(--color-action)] text-white border-transparent'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-sky-300" /> Rover
            </button>

            <button
              onClick={() => setSelectedObjectId('comms')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border cursor-pointer transition ${
                selectedObjectId === 'comms'
                  ? 'bg-[var(--color-action)] text-white border-transparent'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-300" /> Comms
            </button>
          </div>
        </div>

        {/* Right Column: Side Details Card with Advance Day Button */}
        <div className="lg:col-span-5">
          <BuildingPanel
            selectedObjectId={selectedObjectId}
            state={state}
            config={config}
            onApplyAction={(action) => dispatch({ type: 'APPLY_ACTION', payload: action })}
            onAdvanceDay={() => dispatch({ type: 'ADVANCE_DAY' })}
          />
        </div>
      </div>

      {/* Incident Event Modal */}
      {activeIncident && (
        <IncidentModal
          incident={activeIncident}
          onResolveChoice={(choiceId) => dispatch({ type: 'RESOLVE_EVENT', choiceId })}
        />
      )}

      {/* Checkpoint Modal */}
      {showCheckpoint && !activeIncident && (
        <CheckpointModal state={state} onDismiss={handleDismissCheckpoint} />
      )}
    </div>
  );
};