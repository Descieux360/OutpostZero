import { Rocket, Zap, Droplets, ShieldAlert, Sparkles } from 'lucide-react'

interface WelcomeScreenProps {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between bg-[#1B1740] bg-[url('/hero.png')] bg-cover bg-center bg-no-repeat overflow-x-hidden font-sans">
      {/* Dark gradient overlay ensuring WCAG AAA text contrast over hero.png */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B1740] via-[#1B1740]/90 to-[#1B1740]/40 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 py-6 sm:px-12 md:px-20 flex justify-between items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE6D5]/10 backdrop-blur-md border border-[#D4C8B5]/20 text-xs font-extrabold text-[#EFE6D5]">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD25A]" aria-hidden />
          <span>NASA Space Apps Challenge 2026</span>
        </div>
        <span className="text-xs font-bold text-[#6E6A86] hidden sm:block">
          Junior Astronaut Mission Trainer
        </span>
      </header>

      {/* Main Content Hero Section */}
      <section className="relative z-10 my-auto px-6 py-8 sm:px-12 md:px-20 lg:px-24 max-w-4xl">
        {/* Category Pill */}
        <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-[#FF7A3D]/20 text-[#FF7A3D] border border-[#FF7A3D]/30 text-xs font-black uppercase tracking-wider">
          Moon Base Command Simulation
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none drop-shadow-md">
          Outpost Zero
        </h1>

        {/* Subtitle / Objective */}
        <p className="mt-6 max-w-2xl text-lg sm:text-xl font-bold text-[#EFE6D5]/90 leading-relaxed">
          Command a lunar research base for <span className="text-[#FFD25A] underline decoration-2 underline-offset-4">30 simulated days</span>. 
          Balance power grids, recycle water, protect your crew from solar radiation events, and keep life support operational!
        </p>

        {/* Feature Highlights Chips for Ages 7-12 */}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#130F30]/80 border border-[#D4C8B5]/30 text-xs font-extrabold text-[#EFE6D5] backdrop-blur-sm">
            <Zap className="w-4 h-4 text-[#FFD25A]" aria-hidden />
            <span>Power Budgeting</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#130F30]/80 border border-[#D4C8B5]/30 text-xs font-extrabold text-[#EFE6D5] backdrop-blur-sm">
            <Droplets className="w-4 h-4 text-[#60A5FA]" aria-hidden />
            <span>Water Recycling</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#130F30]/80 border border-[#D4C8B5]/30 text-xs font-extrabold text-[#EFE6D5] backdrop-blur-sm">
            <ShieldAlert className="w-4 h-4 text-[#FF7A3D]" aria-hidden />
            <span>Real NASA Space Weather Alerts</span>
          </div>
        </div>

        {/* Action Button CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#FF7A3D] text-white font-black text-lg sm:text-xl btn-chunky hover:bg-[#E66326] transition cursor-pointer shadow-lg active:scale-[0.98]"
          >
            <Rocket className="w-6 h-6 animate-bounce" aria-hidden />
            <span>Start 30-Day Mission</span>
          </button>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 w-full px-6 py-6 sm:px-12 md:px-20 text-xs font-semibold text-[#6E6A86] flex flex-wrap justify-between items-center gap-2 border-t border-[#D4C8B5]/10 bg-[#1B1740]/60 backdrop-blur-md">
        <p>Educational simulation grounded in open space science data. Not a real mission-operations or astronaut-safety tool.</p>
        <p className="text-[11px] opacity-75">Target Audience: Ages 7–12</p>
      </footer>
    </main>
  )
}