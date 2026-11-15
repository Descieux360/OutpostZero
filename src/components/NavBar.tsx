import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, Orbit, X, Rocket, BookOpen, Sparkles } from 'lucide-react'
import { LUNAR_SCENARIO } from '../data/lunarScenario'
import { useMission } from '../features/mission/MissionContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
    isActive
      ? 'bg-[var(--color-action)] text-white shadow-md'
      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
  }`

export function NavBar() {
  const [open, setOpen] = useState(false)
  const { state } = useMission()
  const isMissionActive = state.missionStatus === 'active'
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--color-line)] bg-[#0B0F19]/95 backdrop-blur-md text-[var(--color-regolith)] select-none">
      <nav aria-label="Main Navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-black text-white hover:opacity-90 transition"
          onClick={close}
        >
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-[var(--color-action)] shadow-sm">
            <Orbit size={20} aria-hidden />
          </div>
          <span className="tracking-tight">
            OUTPOST <span className="text-[var(--color-action)]">ZERO</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={navLinkClass} onClick={close}>
            Home
          </NavLink>
          <NavLink to="/levels" className={navLinkClass} onClick={close}>
             Mission Map
          </NavLink>
          <NavLink to="/learn" className={navLinkClass} onClick={close}>
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Lessons
          </NavLink>
          {isMissionActive && (
            <NavLink to="/mission" className={navLinkClass} onClick={close}>
              <Rocket className="w-3.5 h-3.5 text-amber-400" /> Moonbase Console
            </NavLink>
          )}

          {/* Active Mission Day Indicator */}
          {isMissionActive && (
            <div className="ml-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-black text-amber-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Day {state.day} / {LUNAR_SCENARIO.totalDays}</span>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          className="rounded-xl p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 md:hidden cursor-pointer transition"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {open && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-2 border-t-2 border-[var(--color-line)] bg-[#0B0F19] px-4 py-4 md:hidden shadow-2xl animate-in slide-in-from-top-2 duration-150"
        >
          <NavLink to="/" end className={navLinkClass} onClick={close}>
            Home
          </NavLink>
          <NavLink to="/levels" className={navLinkClass} onClick={close}>
             Mission Map
          </NavLink>
          <NavLink to="/learn" className={navLinkClass} onClick={close}>
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Lessons
          </NavLink>
          {isMissionActive && (
            <NavLink to="/mission" className={navLinkClass} onClick={close}>
              <Rocket className="w-3.5 h-3.5 text-amber-400" /> Moonbase Console
            </NavLink>
          )}

          {isMissionActive && (
            <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between px-3 text-xs font-black text-amber-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Mission Telemetry
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-white font-mono">
                Day {state.day} / {LUNAR_SCENARIO.totalDays}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  )
}