import { Link } from 'react-router';
import {
  Rocket,
  ArrowLeft,
  Zap,
  Wind,
  Droplets,
  Utensils,
  Users,
  Sun,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface BriefingScreenProps {
  onBegin: () => void;
}

export function BriefingScreen({ onBegin }: BriefingScreenProps) {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none">
      <div className="max-w-4xl w-full bg-[#161F33] border-4 border-[#374768] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#374768] pb-4">
          <Link
            to="/levels"
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to Mission Map
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-black rounded-full border border-amber-500/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Level 2 · Lunar Simulation
            </span>
          </div>
        </div>

        {/* Title & Mission Statement */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--color-action)]">
            Command Center Telemetry Briefing
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            OUTPOST <span className="text-[var(--color-action)]">ZERO</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-semibold leading-relaxed">
            Welcome, Commander! You are tasked with leading Outpost Zero through a 30-day lunar survival deployment. Maintain base power grid stability, manage vital life support recycling, and protect your 4-person astronaut crew from space radiation.
          </p>
        </div>

        {/* Starting Resource Allocation Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Initial Base Starting Resources
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Energy */}
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 mb-1">
                <Zap className="w-4 h-4" /> Energy Storage
              </div>
              <div className="text-xl font-black text-white">120 <span className="text-xs font-normal text-slate-400">/ 200 kWh</span></div>
              <div className="text-[11px] font-semibold text-emerald-400 mt-1">+45 kWh/day solar yield</div>
            </div>

            {/* Oxygen */}
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-400 mb-1">
                <Wind className="w-4 h-4" /> Oxygen Supply
              </div>
              <div className="text-xl font-black text-white">120 <span className="text-xs font-normal text-slate-400">/ 200 L</span></div>
              <div className="text-[11px] font-semibold text-emerald-400 mt-1">+8 L/day ECLSS scrub</div>
            </div>

            {/* Water */}
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-400 mb-1">
                <Droplets className="w-4 h-4" /> Water Supply
              </div>
              <div className="text-xl font-black text-white">200 <span className="text-xs font-normal text-slate-400">/ 200 L</span></div>
              <div className="text-[11px] font-semibold text-emerald-400 mt-1">+6 L/day recycling</div>
            </div>

            {/* Food */}
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 mb-1">
                <Utensils className="w-4 h-4" /> Food Rations
              </div>
              <div className="text-xl font-black text-white">120 <span className="text-xs font-normal text-slate-400">/ 200 Rations</span></div>
              <div className="text-[11px] font-semibold text-emerald-400 mt-1">+4 Rations/day yield</div>
            </div>
          </div>
        </div>

        {/* Core Rules & Mechanics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <Users className="w-4 h-4 text-amber-400" /> Crew Demands
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Your 4 astronauts consume <span className="text-red-400 font-bold">-8 O2, -5 Water, and -8 Food</span> every single day. Keep production above consumption!
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <Sun className="w-4 h-4 text-orange-400" /> NASA Weather Alerts
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Real solar radiation events (SEP) strike on Days 4, 12, and 22. Sheltering crew or empowering shields prevents disaster.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Daily Actions
            </div>
            <p className="text-xs font-semibold text-slate-300">
              You get 2 commander actions per day to wipe solar dust, scan mineral cores with the rover, or send Earth telemetry for science points.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onBegin}
            className="w-full sm:w-auto px-10 py-4 bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-white font-black text-xl rounded-2xl btn-chunky flex items-center justify-center gap-3 cursor-pointer shadow-xl transition"
          >
            <Rocket className="w-7 h-7" />
            <span>LAUNCH 30-DAY MISSION</span>
          </button>
        </div>

      </div>
    </main>
  );
}

export default BriefingScreen;