import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, Orbit, X } from 'lucide-react'
import { LUNAR_SCENARIO } from '../data/lunarScenario'
import { useMission } from '../features/mission/MissionContext'
import { useAcademyProgress } from '../features/academy/AcademyProgressContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-deck-raised text-white' : 'text-regolith hover:bg-deck hover:text-white'}`

export function NavBar() {
  const [open, setOpen] = useState(false)
  const { state } = useMission()
  const { earthPassed } = useAcademyProgress()
  const missionReady = earthPassed && state.missionStatus !== 'briefing'
  const close = () => setOpen(false)

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={close}>Accueil</NavLink>
      <NavLink to="/levels" className={linkClass} onClick={close}>Missions</NavLink>
      <NavLink to="/learn" className={linkClass} onClick={close}>Leçons</NavLink>
      {missionReady && <NavLink to="/mission" className={linkClass} onClick={close}>Base lunaire</NavLink>}
    </>
  )

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-vacuum/95 backdrop-blur">
      <nav aria-label="Navigation principale" className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white" onClick={close}>
          <Orbit size={20} className="text-nominal" aria-hidden /> Space Academy
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links}
          {state.missionStatus === 'active' && <span className="ml-3 rounded-full border border-line px-3 py-1 text-xs text-dust">Jour {state.day} / {LUNAR_SCENARIO.totalDays}</span>}
        </div>
        <button className="rounded-md p-2 text-regolith hover:bg-deck md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>
      {open && <div id="mobile-menu" className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">{links}{state.missionStatus === 'active' && <p className="px-3 pt-1 text-xs text-dust">Jour {state.day} / {LUNAR_SCENARIO.totalDays}</p>}</div>}
    </header>
  )
}
