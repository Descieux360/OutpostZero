import React from 'react';
import { Link } from 'react-router';
import {
  Zap,
  Wind,
  Droplets,
  Utensils,
  Wrench,
  Home,
  Users,
  Radio,
  Compass,
  BookOpen,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  FlaskConical,
} from 'lucide-react';
import type { SystemId, SystemMode, MissionState, MissionConfig } from '../domain/types';
import { canPerformAction, type PlayerAction } from '../domain/actions';

interface BuildingPanelProps {
  selectedObjectId: string | null;
  state: MissionState;
  config: MissionConfig;
  onApplyAction: (action: PlayerAction) => void;
  onAdvanceDay: () => void;
}

export const BuildingPanel: React.FC<BuildingPanelProps> = ({
  selectedObjectId,
  state,
  config,
  onApplyAction,
  onAdvanceDay,
}) => {
  const activeId = selectedObjectId || 'habitat';
  const system = config.systems.find((s) => s.id === activeId);
  const currentMode: SystemMode = system
    ? state.systemModes[system.id as SystemId] || 'normal'
    : 'normal';

  const activeEffects = system?.effectsByMode[currentMode] || system?.effectsByMode['normal'] || {};

  const getStatusBadge = () => {
    if (!system) return null;
    if (currentMode === 'damaged') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black">
          <AlertOctagon className="w-3.5 h-3.5" /> Damaged
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
        <CheckCircle2 className="w-3.5 h-3.5" /> Operating normally
      </span>
    );
  };

  const getHeaderInfo = () => {
    if (system) {
      const details: Record<SystemId, { name: string; role: string; explainer: string }> = {
        solar: {
          name: 'Solar Power Plant',
          role: 'Base power system',
          explainer: 'Generates electricity from lunar sunlight to power all base modules.',
        },
        habitat: {
          name: 'Habitat Pod',
          role: 'Crew air and water systems',
          explainer: 'Controls environmental life support, scrubs CO2, and purifies drinking water.',
        },
        greenhouse: {
          name: 'Hydroponic Greenhouse',
          role: 'Fresh food production',
          explainer: 'Grows fresh crops without soil to feed the astronaut crew.',
        },
      };

      return {
        ...details[system.id],
        icon:
          system.id === 'solar' ? (
            <Zap className="w-6 h-6 text-amber-400" />
          ) : system.id === 'habitat' ? (
            <Home className="w-6 h-6 text-[var(--color-action)]" />
          ) : (
            <SproutIcon className="w-6 h-6 text-[var(--color-nominal)]" />
          ),
      };
    }

    switch (activeId) {
      case 'crew':
        return {
          name: 'Astronaut Crew',
          role: 'Moonbase crew',
          explainer: 'Monitors health, stamina, and daily consumption of 4 crew members.',
          icon: <Users className="w-6 h-6 text-[var(--color-action)]" />,
        };
      case 'rover':
        return {
          name: 'Lunar Rover',
          role: 'Surface exploration vehicle',
          explainer: 'Explores nearby craters to collect rock samples and science data.',
          icon: <Compass className="w-6 h-6 text-sky-400" />,
        };
      case 'comms':
        return {
          name: 'Radio Comms Array',
          role: 'Link to mission control on Earth',
          explainer: 'Transmits research telemetry to NASA Mission Control on Earth.',
          icon: <Radio className="w-6 h-6 text-orange-400" />,
        };
      default:
        return {
          name: 'Habitat Pod',
          role: 'Crew air and water systems',
          explainer: 'Controls environmental life support, scrubs CO2, and purifies drinking water.',
          icon: <Home className="w-6 h-6 text-[var(--color-action)]" />,
        };
    }
  };

  const header = getHeaderInfo();

  const getDisabledTooltip = (action: PlayerAction) => {
    const check = canPerformAction(state, action);
    if (check.allowed) return undefined;
    return state.actionsLeft <= 0
      ? 'No Commander Actions Remaining Today'
      : 'Resource Requirements Not Met';
  };

  const renderCommanderAction = (
    action: PlayerAction,
    label: string,
    description: string,
    resourceCost: string,
    Icon: typeof Zap,
    buttonClass: string,
  ) => {
    const check = canPerformAction(state, action);
    const tooltip = getDisabledTooltip(action);
    const tooltipId = `action-tooltip-${action.type}`;

    return (
      <div
        className="group relative"
        key={action.type}
        tabIndex={tooltip ? 0 : undefined}
        title={tooltip}
        aria-describedby={tooltip ? tooltipId : undefined}
      >
        <button
          onClick={() => onApplyAction(action)}
          disabled={!check.allowed}
          aria-describedby={tooltip ? tooltipId : undefined}
          className={`w-full rounded-xl border px-4 py-3.5 text-left btn-chunky transition ${
            check.allowed
              ? buttonClass
              : 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500 opacity-60'
          }`}
        >
          <span className="flex items-center gap-2 text-sm font-extrabold">
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </span>
          <span className="mt-1 block text-xs font-semibold leading-relaxed opacity-90">{description}</span>
          <span className="mt-2 block text-[11px] font-bold">
            Costs 1 Commander Action · {resourceCost}
          </span>
        </button>
        {tooltip && (
          <span
            id={tooltipId}
            role="tooltip"
            className="invisible absolute bottom-full left-0 z-10 mb-2 w-64 rounded-lg border border-[var(--color-line)] bg-[var(--color-deck)] p-2 text-xs font-bold text-white opacity-0 shadow-xl group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
          >
            <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-amber-400" aria-hidden />
            {tooltip}
          </span>
        )}
      </div>
    );
  };

  const renderRepairButton = () => {
    if (!system || currentMode !== 'damaged') return null;
    return renderCommanderAction(
      { type: 'REPAIR_SYSTEM', systemId: system.id },
      'Emergency System Repair',
      'Fix this system and return it to normal operation.',
      '15 Energy',
      Wrench,
      'bg-[var(--color-action)] text-white hover:bg-[var(--color-action-hover)] border-transparent',
    );
  };

  const formatResourceValue = (val?: number) => {
    if (val === undefined || val === 0) return '0';
    return val > 0 ? `+${val}` : `${val}`;
  };

  return (
    <div className="w-full bg-[var(--color-deck)] border-2 border-[var(--color-line)] rounded-3xl p-6 shadow-xl text-[var(--color-regolith)] flex flex-col justify-between space-y-6">
      {/* 1. Header Section */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            {header.icon}
            <span>{header.name}</span>
          </h2>
          {getStatusBadge()}
        </div>
        <p className="text-xs font-bold text-[var(--color-dust)]">{header.role}</p>
        <p className="text-sm font-semibold text-slate-300 leading-relaxed pt-1">
          {header.explainer}
        </p>
      </div>

      {/* 2. Constant Daily Resource Rates */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--color-dust)]">
            Daily Effects
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            <FlaskConical className="w-3 h-3" /> Per day
          </span>
        </div>

        {system ? (
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/70 font-bold text-sm">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Zap className="w-4 h-4 text-amber-400" /> Energy
              </span>
              <span className={activeEffects.energy && activeEffects.energy > 0 ? 'text-emerald-400 font-black' : activeEffects.energy && activeEffects.energy < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.energy)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Wind className="w-4 h-4 text-sky-400" /> Oxygen
              </span>
              <span className={activeEffects.oxygen && activeEffects.oxygen > 0 ? 'text-emerald-400 font-black' : activeEffects.oxygen && activeEffects.oxygen < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.oxygen)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Droplets className="w-4 h-4 text-blue-400" /> Water
              </span>
              <span className={activeEffects.water && activeEffects.water > 0 ? 'text-emerald-400 font-black' : activeEffects.water && activeEffects.water < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.water)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Utensils className="w-4 h-4 text-emerald-400" /> Food
              </span>
              <span className={activeEffects.food && activeEffects.food > 0 ? 'text-emerald-400 font-black' : activeEffects.food && activeEffects.food < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.food)}
              </span>
            </div>
          </div>
        ) : activeId === 'crew' ? (
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/70 font-bold text-sm text-red-400">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5"><Wind className="w-4 h-4" /> Oxygen:</span>
              <span className="font-black">-8</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5"><Droplets className="w-4 h-4" /> Water:</span>
              <span className="font-black">-5</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5"><Utensils className="w-4 h-4" /> Food:</span>
              <span className="font-black">-8</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 text-slate-400">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Energy:</span>
              <span>0</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/70 text-xs font-semibold text-slate-300">
            Surface equipment. Choose an action below to send a command.
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--color-dust)]">
            Commander Actions
          </span>
          <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
            Daily Actions Left: {state.actionsLeft}
          </span>
        </div>

        {renderRepairButton()}

        {system?.id === 'solar' && currentMode !== 'damaged' && (
          renderCommanderAction(
            { type: 'CLEAN_SOLAR_PANELS' },
            'Wipe Solar Dust',
            'Clean solar collectors to restore peak power generation.',
            '5 Energy',
            Sparkles,
            'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400',
          )
        )}

        {activeId === 'rover' && (
          renderCommanderAction(
            { type: 'ROVER_COLLECT_SAMPLES' },
            'Scan Craters with Rover',
            'Explore lunar surface to gather science points.',
            '20 Energy · +100 Science',
            Compass,
            'bg-[var(--color-action)] text-white border-transparent hover:bg-[var(--color-action-hover)]',
          )
        )}

        {activeId === 'comms' && (
          renderCommanderAction(
            { type: 'COMMS_TRANSMIT_REPORT' },
            'Transmit Earth Telemetry',
            'Send daily mission logs back to Earth for bonus science.',
            '15 Energy · +50 Science',
            Radio,
            'bg-[var(--color-action)] text-white border-transparent hover:bg-[var(--color-action-hover)]',
          )
        )}
      </div>

      {system?.lessonId && (
        <div className="pt-2 border-t border-[var(--color-line)]">
          <Link
            to={`/learn/${system.lessonId}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-extrabold text-xs hover:border-[var(--color-action)] transition"
          >
            <BookOpen className="w-4 h-4 text-[var(--color-action)]" />
            <span>Discover Space Science: {header.name}</span>
          </Link>
        </div>
      )}

      {/* 5. ADVANCE DAY BUTTON AT THE BOTTOM OF SIDE PANEL */}
      <div className="pt-4 border-t-2 border-[var(--color-line)]">
        <button
          onClick={onAdvanceDay}
          disabled={!!state.pendingEventId}
          title={state.pendingEventId ? 'Resolve the current incident before advancing.' : undefined}
          className="w-full py-4 px-6 bg-[var(--color-action)] text-white font-black text-base rounded-2xl btn-chunky flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--color-action-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
        >
          <span>Advance Day →</span>
        </button>
      </div>
    </div>
  );
};

function SproutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0C9 5 4 7 4 12c0 3 2 5.5 5 6.5M12 5c3 0 8 2 8 7 0 3-2 5.5-5 6.5" />
    </svg>
  );
}