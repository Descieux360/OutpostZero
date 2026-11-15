import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Home, Settings, Star, X } from 'lucide-react'
import { ACADEMY_LEVELS } from '../../data/academyLevels'
import { useAcademyProgress } from './AcademyProgressContext'
import { SpaceMissionBackdrop } from './SpaceMissionBackdrop'

function PlanetMedallion({ levelId }: { levelId: string }) {
  const gradientId = `planet-${levelId}`
  return (
    <span className="planet-medallion">
      <svg viewBox="0 0 120 120" role="img" aria-label={levelId === 'earth' ? 'Illustration of Earth' : 'Illustration of the Moon'}>
        <defs>
          <radialGradient id={`${gradientId}-earth`} cx="32%" cy="27%"><stop offset="0" stopColor="#83e5ff"/><stop offset=".65" stopColor="#1687e8"/><stop offset="1" stopColor="#07346d"/></radialGradient>
          <radialGradient id={`${gradientId}-moon`} cx="34%" cy="27%"><stop offset="0" stopColor="#f8fafc"/><stop offset="1" stopColor="#64748b"/></radialGradient>
          <clipPath id={`${gradientId}-clip`}><circle cx="60" cy="60" r="47"/></clipPath>
        </defs>
        <circle cx="60" cy="60" r="49" fill={levelId === 'earth' ? `url(#${gradientId}-earth)` : `url(#${gradientId}-moon)`} stroke={levelId === 'earth' ? '#8be7ff' : '#dbeafe'} strokeWidth="3"/>
        {levelId === 'earth' && <g clipPath={`url(#${gradientId}-clip)`} fill="#43c878"><path d="M20 43l15-17 19 2 9 12-8 10 9 8-10 13-15 2-4 16-13 3-8-12-1-21-11-9z"/><path d="M73 26l16-7 19 9 7 15-12 8-4 16-12 8-10-12 3-17-11-9z"/><path d="M80 78l13-7 12 5 3 12-11 8-4 14-11 6-8-11 3-13z"/></g>}
        {levelId === 'moon' && <g fill="#52627b" opacity=".72"><circle cx="43" cy="43" r="9"/><circle cx="76" cy="36" r="5"/><circle cx="72" cy="70" r="12"/><circle cx="40" cy="78" r="5"/><circle cx="91" cy="55" r="3"/></g>}
        <path d="M26 38q17-26 42-21" fill="none" stroke="#fff" strokeWidth="3" opacity=".24"/>
      </svg>
    </span>
  )
}

export function LevelSelectionScreen() {
  const progress = useAcademyProgress()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem('space-academy-motion') !== 'off')

  useEffect(() => {
    document.documentElement.classList.toggle('motion-off', !animationsEnabled)
    localStorage.setItem('space-academy-motion', animationsEnabled ? 'on' : 'off')
    return () => document.documentElement.classList.remove('motion-off')
  }, [animationsEnabled])

  const levelCards = ACADEMY_LEVELS.filter((lvl) => lvl.id !== 'mars').map((level) => {
    const isPassed = progress[`${level.id}Passed` as 'earthPassed' | 'moonPassed']
    const targetPath = level.id === 'earth' ? '/training/earth' : '/briefing'

    return (
      <Link
        key={level.id}
        to={targetPath}
        className="mission-node-link block text-left"
        aria-label={`Open level ${level.number}: ${level.title}`}
      >
        <article className="mission-node-card mission-node-ready">
          <div className="mission-node-orbit">
            <PlanetMedallion levelId={level.id} />
            <span className="mission-node-number">LEVEL {level.number}</span>
            {isPassed && <span className="mission-node-check" aria-label="Level completed"><Check size={16}/></span>}
          </div>
          <div className="mission-node-info">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-cyan-400/15 text-cyan-100">
                {isPassed ? 'Completed' : 'Available'}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-black text-yellow-200">
                <Star size={16} fill={progress.stars[level.id] ? 'currentColor' : 'none'} className={progress.stars[level.id] ? 'text-yellow-300' : 'text-slate-500'}/>
                {progress.stars[level.id] || 0}/1
              </span>
            </div>
            <h2 className="mt-3 text-xl font-black leading-tight text-white">{level.title}</h2>
            <p className="mt-1 text-sm font-bold text-cyan-100">{level.subtitle}</p>
            <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-200">{level.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm font-extrabold">
              <span className="text-yellow-100">{isPassed ? 'Revisit Mission' : 'Start Mission'}</span>
              <ArrowRight size={18} className="text-yellow-300"/>
            </div>
          </div>
        </article>
      </Link>
    )
  })

  return (
    <main className="mission-map-page relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#06143D] px-4 pb-8 pt-5 sm:px-7 sm:pt-7">
      <SpaceMissionBackdrop/>
      <div className="mission-map-vignette" aria-hidden="true"/>
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* <div className="flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#071943]/70 px-3 py-2 text-sm font-black text-white backdrop-blur transition hover:border-cyan-200 hover:bg-[#0a2457]">
            <ArrowLeft size={17}/> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" aria-label="Home" title="Home" className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-[#071943]/70 text-white backdrop-blur transition hover:border-cyan-200 hover:text-cyan-100"><Home size={18}/></Link>
            <button onClick={() => setSettingsOpen(true)} aria-label="Settings" title="Settings" className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-[#071943]/70 text-white backdrop-blur transition hover:border-cyan-200 hover:text-cyan-100"><Settings size={18}/></button>
          </div>
        </div> */}

        <header className="animate-enter mx-auto mt-5 max-w-3xl text-center sm:mt-7">
          <p className="text-xs font-black uppercase tracking-[.28em] text-cyan-200 sm:text-sm">Space Academy · Mission Center</p>
          <h1 className="mt-2 text-3xl font-black text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.8)] sm:text-5xl">Mission Map</h1>
          <p className="mx-auto mt-3 max-w-2xl rounded-2xl border border-white/10 bg-[#06143D]/55 px-4 py-2.5 text-sm leading-6 text-slate-100 shadow-lg backdrop-blur-sm sm:text-base">
            Select a destination to begin your training or command the Lunar outpost.
          </p>
        </header>

        <section className="mission-route relative mx-auto mt-5 max-w-6xl sm:mt-7" aria-label="Choose a mission level">
          <div className="mission-node-grid flex justify-center gap-6">{levelCards}</div>
        </section>

        <footer className="relative z-10 mx-auto mt-5 max-w-3xl rounded-xl border border-white/10 bg-[#06143D]/55 px-4 py-2.5 text-center text-xs leading-5 text-slate-200 backdrop-blur-sm">
          Simulation metrics are simplified game units, not real space mission specifications.
        </footer>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="settings-title" className="w-full max-w-md rounded-3xl border border-cyan-200/25 bg-[#0b1838] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between"><h2 id="settings-title" className="text-xl font-black">Display Settings</h2><button onClick={() => setSettingsOpen(false)} aria-label="Close" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X size={19}/></button></div>
            <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
              <span><span className="block font-bold">Space Animations</span><span className="mt-1 block text-xs text-slate-400">Stars, planets, and animated transitions.</span></span>
              <input type="checkbox" checked={animationsEnabled} onChange={(event) => setAnimationsEnabled(event.target.checked)} className="h-5 w-5 accent-cyan-400"/>
            </label>
            <button onClick={() => setSettingsOpen(false)} className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 font-black text-slate-950 hover:bg-cyan-300">Done</button>
          </section>
        </div>
      )}
    </main>
  )
}