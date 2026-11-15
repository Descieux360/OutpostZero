import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Check, Home, Lock, Settings, Star, X } from 'lucide-react'
import { ACADEMY_LEVELS } from '../../data/academyLevels'
import { useAcademyProgress } from './AcademyProgressContext'
import { SpaceMissionBackdrop } from './SpaceMissionBackdrop'

function PlanetMedallion({ levelId, locked }: { levelId: string; locked: boolean }) {
  const gradientId = `planet-${levelId}`
  return (
    <span className={`planet-medallion ${locked ? 'planet-locked' : ''}`}>
      <svg viewBox="0 0 120 120" role="img" aria-label={levelId === 'earth' ? 'Illustration de la Terre' : levelId === 'moon' ? 'Illustration de la Lune' : 'Illustration de Mars'}>
        <defs>
          <radialGradient id={`${gradientId}-earth`} cx="32%" cy="27%"><stop offset="0" stopColor="#83e5ff"/><stop offset=".65" stopColor="#1687e8"/><stop offset="1" stopColor="#07346d"/></radialGradient>
          <radialGradient id={`${gradientId}-moon`} cx="34%" cy="27%"><stop offset="0" stopColor="#f8fafc"/><stop offset="1" stopColor="#64748b"/></radialGradient>
          <radialGradient id={`${gradientId}-mars`} cx="31%" cy="26%"><stop offset="0" stopColor="#ffbd80"/><stop offset=".6" stopColor="#f15a24"/><stop offset="1" stopColor="#8c2e28"/></radialGradient>
          <clipPath id={`${gradientId}-clip`}><circle cx="60" cy="60" r="47"/></clipPath>
        </defs>
        {levelId === 'mars' && <ellipse cx="60" cy="60" rx="56" ry="18" fill="none" stroke="#ffcc80" strokeWidth="2" opacity=".55" transform="rotate(-22 60 60)"/>}
        <circle cx="60" cy="60" r="49" fill={levelId === 'earth' ? `url(#${gradientId}-earth)` : levelId === 'moon' ? `url(#${gradientId}-moon)` : `url(#${gradientId}-mars)`} stroke={levelId === 'earth' ? '#8be7ff' : levelId === 'moon' ? '#dbeafe' : '#ffb36e'} strokeWidth="3"/>
        {levelId === 'earth' && <g clipPath={`url(#${gradientId}-clip)`} fill="#43c878"><path d="M20 43l15-17 19 2 9 12-8 10 9 8-10 13-15 2-4 16-13 3-8-12-1-21-11-9z"/><path d="M73 26l16-7 19 9 7 15-12 8-4 16-12 8-10-12 3-17-11-9z"/><path d="M80 78l13-7 12 5 3 12-11 8-4 14-11 6-8-11 3-13z"/></g>}
        {levelId === 'moon' && <g fill="#52627b" opacity=".72"><circle cx="43" cy="43" r="9"/><circle cx="76" cy="36" r="5"/><circle cx="72" cy="70" r="12"/><circle cx="40" cy="78" r="5"/><circle cx="91" cy="55" r="3"/></g>}
        {levelId === 'mars' && <g clipPath={`url(#${gradientId}-clip)`} fill="none" stroke="#8c3029" strokeWidth="6" opacity=".55"><path d="M15 42q24-17 42 0t50-8"/><path d="M19 74q29 12 42-7t46 11"/><path d="M47 13q-2 20 11 27t-2 27"/></g>}
        <path d="M26 38q17-26 42-21" fill="none" stroke="#fff" strokeWidth="3" opacity=".24"/>
      </svg>
      {locked && <span className="planet-lock-mark"><Lock size={22} aria-hidden/></span>}
    </span>
  )
}

export function LevelSelectionScreen() {
  const progress = useAcademyProgress()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(() => localStorage.getItem('space-academy-motion') !== 'off')
  const unlocked: Record<string, boolean> = { earth: true, moon: progress.earthPassed, mars: progress.moonPassed }
  const destination: Record<string, string> = { earth: progress.earthPassed ? '/briefing' : '/training/earth', moon: '/briefing', mars: '/mars' }

  useEffect(() => {
    document.documentElement.classList.toggle('motion-off', !animationsEnabled)
    localStorage.setItem('space-academy-motion', animationsEnabled ? 'on' : 'off')
    return () => document.documentElement.classList.remove('motion-off')
  }, [animationsEnabled])

  const levelCards = ACADEMY_LEVELS.map((level) => {
    const isUnlocked = unlocked[level.id]
    const isPassed = progress[`${level.id}Passed` as 'earthPassed' | 'moonPassed' | 'marsPassed']
    const node = (
      <article className={`mission-node-card ${isUnlocked ? 'mission-node-ready' : 'mission-node-locked'}`}>
        <div className="mission-node-orbit">
          <PlanetMedallion levelId={level.id} locked={!isUnlocked}/>
          <span className="mission-node-number">NIVEAU {level.number}</span>
          {isPassed && <span className="mission-node-check" aria-label="Niveau réussi"><Check size={16}/></span>}
        </div>
        <div className="mission-node-info">
          <div className="flex items-center justify-between gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${isUnlocked ? 'bg-cyan-400/15 text-cyan-100' : 'bg-slate-800/80 text-slate-400'}`}>
              {isPassed ? 'Réussi' : isUnlocked ? 'Disponible' : 'Verrouillé'}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-black text-yellow-200" aria-label={`${progress.stars[level.id]} étoile gagnée`}>
              <Star size={16} fill={progress.stars[level.id] ? 'currentColor' : 'none'} className={progress.stars[level.id] ? 'text-yellow-300' : 'text-slate-500'}/>
              {progress.stars[level.id]}/1
            </span>
          </div>
          <h2 className="mt-3 text-xl font-black leading-tight text-white">{level.title}</h2>
          <p className="mt-1 text-sm font-bold text-cyan-100">{level.subtitle}</p>
          <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-200">{level.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm font-extrabold">
            <span className={isUnlocked ? 'text-yellow-100' : 'text-slate-400'}>{isPassed ? 'Revoir la mission' : isUnlocked ? 'Prêt à commencer' : 'Réussis le test précédent'}</span>
            {isUnlocked ? <ArrowRight size={18} className="text-yellow-300"/> : <Lock size={16} className="text-slate-500"/>}
          </div>
        </div>
      </article>
    )
    return isUnlocked ? <Link key={level.id} to={destination[level.id]} className="mission-node-link" aria-label={`Ouvrir le niveau ${level.number} : ${level.title}`}>{node}</Link> : <div key={level.id} className="mission-node-link" aria-disabled="true">{node}</div>
  })

  return (
    <main className="mission-map-page relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#06143D] px-4 pb-8 pt-5 sm:px-7 sm:pt-7">
      <SpaceMissionBackdrop/>
      <div className="mission-map-vignette" aria-hidden="true"/>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-[#071943]/70 px-3 py-2 text-sm font-black text-white backdrop-blur transition hover:border-cyan-200 hover:bg-[#0a2457]">
            <ArrowLeft size={17}/> <span className="hidden sm:inline">Retour</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" aria-label="Accueil" title="Accueil" className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-[#071943]/70 text-white backdrop-blur transition hover:border-cyan-200 hover:text-cyan-100"><Home size={18}/></Link>
            <button onClick={() => setSettingsOpen(true)} aria-label="Paramètres" title="Paramètres" className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-[#071943]/70 text-white backdrop-blur transition hover:border-cyan-200 hover:text-cyan-100"><Settings size={18}/></button>
          </div>
        </div>

        <header className="animate-enter mx-auto mt-5 max-w-3xl text-center sm:mt-7">
          <p className="text-xs font-black uppercase tracking-[.28em] text-cyan-200 sm:text-sm">Space Academy · Centre de mission</p>
          <h1 className="mt-2 text-3xl font-black text-white drop-shadow-[0_3px_12px_rgba(0,0,0,.8)] sm:text-5xl">Carte des missions</h1>
          <p className="mx-auto mt-3 max-w-2xl rounded-2xl border border-white/10 bg-[#06143D]/55 px-4 py-2.5 text-sm leading-6 text-slate-100 shadow-lg backdrop-blur-sm sm:text-base">
            Chaque destination t’apprend de nouvelles compétences. Réussis le test d’un niveau pour débloquer le suivant.
          </p>
        </header>

        <section className="mission-route relative mx-auto mt-5 max-w-6xl sm:mt-7" aria-label="Choisis un niveau de mission">
          <svg className="mission-route-line" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
            <defs><filter id="routeGlow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="routeGradient"><stop offset="0" stopColor="#ffd700"/><stop offset=".5" stopColor="#fff18a"/><stop offset="1" stopColor="#ffd700"/></linearGradient></defs>
            <path d="M190 64 C330 5 455 128 600 64 S865 4 1010 64" fill="none" stroke="#ffd700" strokeWidth="5" strokeDasharray="12 10" strokeLinecap="round" filter="url(#routeGlow)" opacity=".94"/>
            <path d="M190 64 C330 5 455 128 600 64 S865 4 1010 64" fill="none" stroke="url(#routeGradient)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="mission-node-grid">{levelCards}</div>
        </section>

        <footer className="relative z-10 mx-auto mt-5 max-w-3xl rounded-xl border border-white/10 bg-[#06143D]/55 px-4 py-2.5 text-center text-xs leading-5 text-slate-200 backdrop-blur-sm">
          Les chiffres de simulation sont des unités de jeu simplifiées, pas des consignes réelles de mission.
        </footer>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="settings-title" className="w-full max-w-md rounded-3xl border border-cyan-200/25 bg-[#0b1838] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between"><h2 id="settings-title" className="text-xl font-black">Paramètres d’affichage</h2><button onClick={() => setSettingsOpen(false)} aria-label="Fermer" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X size={19}/></button></div>
            <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
              <span><span className="block font-bold">Animations spatiales</span><span className="mt-1 block text-xs text-slate-400">Étoiles, planètes et transitions animées.</span></span>
              <input type="checkbox" checked={animationsEnabled} onChange={(event) => setAnimationsEnabled(event.target.checked)} className="h-5 w-5 accent-cyan-400"/>
            </label>
            <p className="mt-4 text-xs leading-5 text-slate-400">Le réglage système « réduire les animations » reste prioritaire pour le confort visuel.</p>
            <button onClick={() => setSettingsOpen(false)} className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 font-black text-slate-950 hover:bg-cyan-300">Terminé</button>
          </section>
        </div>
      )}
    </main>
  )
}
