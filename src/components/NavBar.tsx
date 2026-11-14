import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, Orbit, X } from 'lucide-react'
import { lunarScenario } from '../data/lunarScenario'
import { useMission } from '../features/mission/MissionContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-deck-raised text-white' : 'text-regolith hover:bg-deck hover:text-white'}`

export function NavBar() {
  const [open, setOpen] = useState(false)
  const { state } = useMission()
  const missionReady = state.missionStatus !== 'briefing'
  const close = () => setOpen(false)

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={close}>Home</NavLink>
      <NavLink to="/briefing" className={linkClass} onClick={close}>Briefing</NavLink>
      {missionReady ? (
        <NavLink to="/mission" className={linkClass} onClick={close}>Mission Control</NavLink>
      ) : (
        <span aria-disabled="true" title="Begin the mission from the briefing first" className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-dust">
          Mission Control <span className="text-xs">(begin from briefing)</span>
        </span>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-vacuum/95 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold text-white" onClick={close}>
          <Orbit size={20} className="text-nominal" aria-hidden /> Outpost Zero
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links}
          {state.missionStatus === 'active' && (
            <span className="ml-3 rounded-full border border-line px-3 py-1 text-xs text-dust">Day {state.day} of {lunarScenario.totalDays}</span>
          )}
        </div>

        <button className="rounded-md p-2 text-regolith hover:bg-deck md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">
          {links}
          {state.missionStatus === 'active' && <p className="px-3 pt-1 text-xs text-dust">Day {state.day} of {lunarScenario.totalDays}</p>}
        </div>
      )}
    </header>
  )
}