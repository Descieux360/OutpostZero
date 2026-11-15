import React from 'react';
import { Rocket, Zap, Wind, Sun, Sparkles, ShieldCheck, Award, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0B0F19] bg-[url('/hero.png')] bg-cover bg-center text-[#F8FAFC] flex flex-col justify-between font-sans select-none">
      {/* 1. ATMOSPHERIC GRADIENT OVERLAY FOR TEXT READABILITY */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0B0F19]/75 via-[#0B0F19]/35 to-[#0B0F19]/90 backdrop-blur-[0.5px] z-0" />

      {/* 2. TOP BADGE HEADER */}
      <header className="relative z-10 pt-8 px-6 text-center flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-300 shadow-xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>NASA Space Apps Challenge · Youth Edition</span>
        </div>
      </header>

      {/* 3. HERO MAIN CONTENT */}
      <section className="relative z-10 my-auto mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-8 text-center">
        {/* Title & Tagline */}
        <div className="space-y-3 mb-6">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--color-action)]">
            Moonbase Command Simulator
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
            OUTPOST <span className="text-[var(--color-action)]">ZERO</span>
          </h1>
          <p className="text-lg sm:text-2xl font-black text-slate-200 max-w-2xl mx-auto pt-1 drop-shadow-md">
            Command your own lunar station & keep your astronaut crew safe for 30 days!
          </p>
        </div>

        {/* Primary Play Button */}
        <div className="mb-10">
          <button
            onClick={onContinue}
            className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-[var(--color-action)] px-10 py-5 text-2xl font-black uppercase tracking-wider text-white shadow-[0_8px_0_0_#C2410C] transition hover:translate-y-[-2px] hover:bg-[var(--color-action-hover)] active:translate-y-[4px] active:shadow-[0_2px_0_0_#C2410C] cursor-pointer"
          >
            <Rocket className="w-8 h-8 transition-transform group-hover:rotate-12 group-hover:scale-110" />
            <span>START MISSION</span>
            <ArrowRight className="w-7 h-7 opacity-80 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4. KID-FRIENDLY FEATURE CARDS (ENGLISH) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          {/* Card 1: Solar Power */}
          <div className="p-4 rounded-2xl bg-[#161F33]/90 border-2 border-[#374768] shadow-xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-1">Solar Power</h3>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              Clean moon dust off solar collectors to generate electricity for your base.
            </p>
          </div>

          {/* Card 2: Life Support */}
          <div className="p-4 rounded-2xl bg-[#161F33]/90 border-2 border-[#374768] shadow-xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center mb-3">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-1">Life Support</h3>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              Recycle air and water continuously so your astronauts stay healthy and active.
            </p>
          </div>

          {/* Card 3: NASA Satellites */}
          <div className="p-4 rounded-2xl bg-[#161F33]/90 border-2 border-[#374768] shadow-xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-1">NASA Satellites</h3>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              Respond to real-world solar radiation events detected by NASA DONKI sensors!
            </p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="relative z-10 pb-6 pt-4 text-center border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-extrabold text-slate-300">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Award className="w-4 h-4" /> Designed for Explorers (Ages 7–12)
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Interactive NASA Science Simulation
          </span>
        </div>
      </footer>
    </main>
  );
};