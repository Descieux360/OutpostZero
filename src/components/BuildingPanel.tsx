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
  ArrowRight,
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
          <AlertOctagon className="w-3.5 h-3.5" /> Endommagé
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
        <CheckCircle2 className="w-3.5 h-3.5" /> Fonctionne normalement
      </span>
    );
  };

  const getHeaderInfo = () => {
    if (system) {
      return {
        name: system.name,
        explainer: system.explainer,
        role: system.role,
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
          name: 'Équipage d’astronautes',
          role: 'Équipage de la base lunaire',
          explainer: 'L’équipage a besoin d’oxygène, d’eau et de nourriture chaque jour pour rester en bonne santé.',
          icon: <Users className="w-6 h-6 text-[var(--color-action)]" />,
        };
      case 'rover':
        return {
          name: 'Rover lunaire autonome',
          role: 'Véhicule d’exploration de la surface',
          explainer: 'Explore les cratères lunaires et collecte des échantillons pour la recherche.',
          icon: <Compass className="w-6 h-6 text-sky-400" />,
        };
      case 'comms':
        return {
          name: 'Antenne de communication',
          role: 'Lien de communication avec la Terre',
          explainer: 'Transmet les données de la base et les rapports à l’équipe au sol.',
          icon: <Radio className="w-6 h-6 text-orange-400" />,
        };
      default:
        return {
          name: 'Habitat et support-vie',
          role: 'Système de contrôle de l’habitat',
          explainer: 'Recycle l’air et l’eau pour soutenir l’équipage.',
          icon: <Home className="w-6 h-6 text-[var(--color-action)]" />,
        };
    }
  };

  const header = getHeaderInfo();

  const renderRepairButton = () => {
    if (!system || currentMode !== 'damaged') return null;
    const action: PlayerAction = { type: 'REPAIR_SYSTEM', systemId: system.id };
    const check = canPerformAction(state, action);

    return (
      <button
        onClick={() => onApplyAction(action)}
        disabled={!check.allowed}
        className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm btn-chunky flex items-center justify-center gap-2 cursor-pointer transition ${
          check.allowed
            ? 'bg-[var(--color-action)] text-white hover:bg-[var(--color-action-hover)]'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span>Réparation d’urgence (−15 énergie)</span>
        {!check.allowed && (
          <span className="text-xs font-semibold text-red-400 flex items-center gap-1 ml-2">
            <AlertTriangle className="w-3.5 h-3.5" /> {check.reason}
          </span>
        )}
      </button>
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
            Effets quotidiens
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            <FlaskConical className="w-3 h-3" /> Par jour
          </span>
        </div>

        {system ? (
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/70 font-bold text-sm">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Zap className="w-4 h-4 text-amber-400" /> Énergie
              </span>
              <span className={activeEffects.energy && activeEffects.energy > 0 ? 'text-emerald-400 font-black' : activeEffects.energy && activeEffects.energy < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.energy)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Wind className="w-4 h-4 text-sky-400" /> Oxygène
              </span>
              <span className={activeEffects.oxygen && activeEffects.oxygen > 0 ? 'text-emerald-400 font-black' : activeEffects.oxygen && activeEffects.oxygen < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.oxygen)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Droplets className="w-4 h-4 text-blue-400" /> Eau
              </span>
              <span className={activeEffects.water && activeEffects.water > 0 ? 'text-emerald-400 font-black' : activeEffects.water && activeEffects.water < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.water)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5 font-extrabold">
                <Utensils className="w-4 h-4 text-emerald-400" /> Nourriture
              </span>
              <span className={activeEffects.food && activeEffects.food > 0 ? 'text-emerald-400 font-black' : activeEffects.food && activeEffects.food < 0 ? 'text-red-400 font-black' : 'text-slate-400'}>
                {formatResourceValue(activeEffects.food)}
              </span>
            </div>
          </div>
        ) : activeId === 'crew' ? (
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/70 font-bold text-sm text-red-400">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5"><Wind className="w-4 h-4" /> Oxygène:</span>
              <span className="font-black">-8</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5"><Droplets className="w-4 h-4" /> Eau:</span>
              <span className="font-black">-5</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300 flex items-center gap-1.5"><Utensils className="w-4 h-4" /> Nourriture:</span>
              <span className="font-black">-8</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 text-slate-400">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Énergie:</span>
              <span>0</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/70 text-xs font-semibold text-slate-300">
            Équipement de surface. Choisis une action ci-dessous pour envoyer une commande.
          </div>
        )}
      </div>

      {/* 3. Actions & Maintenance */}
      <div className="space-y-3">
        {renderRepairButton()}

        {system?.id === 'solar' && currentMode !== 'damaged' && (
          <button
            onClick={() => onApplyAction({ type: 'CLEAN_SOLAR_PANELS' })}
            className="w-full py-3.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-extrabold text-xs btn-chunky flex items-center justify-center gap-2 hover:border-amber-400 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Nettoyer les panneaux (−5 énergie)
          </button>
        )}

        {activeId === 'rover' && (
          <button
            onClick={() => onApplyAction({ type: 'ROVER_COLLECT_SAMPLES' })}
            className="w-full py-3.5 px-4 rounded-xl bg-[var(--color-action)] text-white font-extrabold text-sm btn-chunky flex items-center justify-center gap-2 hover:bg-[var(--color-action-hover)] transition cursor-pointer"
          >
            <Compass className="w-4 h-4" /> Analyser des échantillons (−20 énergie, +100 science)
          </button>
        )}

        {activeId === 'comms' && (
          <button
            onClick={() => onApplyAction({ type: 'COMMS_TRANSMIT_REPORT' })}
            className="w-full py-3.5 px-4 rounded-xl bg-[var(--color-action)] text-white font-extrabold text-sm btn-chunky flex items-center justify-center gap-2 hover:bg-[var(--color-action-hover)] transition cursor-pointer"
          >
            <Radio className="w-4 h-4" /> Transmettre à la Terre (−15 énergie, +50 science)
          </button>
        )}
      </div>

      {/* 4. Learn Science Link */}
      {system?.lessonId && (
        <div className="pt-2 border-t border-[var(--color-line)]">
          <Link
            to={`/learn/${system.lessonId}`}
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-extrabold text-xs hover:border-[var(--color-action)] transition"
          >
            <BookOpen className="w-4 h-4 text-[var(--color-action)]" />
            <span>Découvrir la science : {system.name}</span>
          </Link>
        </div>
      )}

      {/* 5. ADVANCE DAY BUTTON AT THE BOTTOM OF SIDE PANEL */}
      <div className="pt-4 border-t-2 border-[var(--color-line)]">
        <button
          onClick={onAdvanceDay}
          disabled={!!state.pendingEventId}
          className="w-full py-4 px-6 bg-[var(--color-action)] text-white font-black text-base rounded-2xl btn-chunky flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--color-action-hover)] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition"
        >
          <span>Avancer d’un jour</span>
          <ArrowRight className="w-5 h-5" />
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