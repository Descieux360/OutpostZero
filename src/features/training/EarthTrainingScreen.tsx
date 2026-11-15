import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Check, CircleHelp, GraduationCap, Compass, Wrench, FlaskConical, UserRound } from 'lucide-react'
import { earthTrainingModules } from '../../data/training/earthModules'
import { useAcademyProgress, type AstronautRole } from '../academy/AcademyProgressContext'

export function EarthTrainingScreen() {
  const progress = useAcademyProgress()
  const [astronautName, setAstronautName] = useState(progress.astronautName)
  const [astronautRole, setAstronautRole] = useState<AstronautRole | null>(progress.astronautRole)
  const firstIncomplete = earthTrainingModules.findIndex((module) => !progress.earthModulesCompleted.includes(module.id))
  const [activeIndex, setActiveIndex] = useState(Math.max(0, firstIncomplete))
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const module = earthTrainingModules[activeIndex]
  const allComplete = earthTrainingModules.every((item) => progress.earthModulesCompleted.includes(item.id))
  const isComplete = progress.earthModulesCompleted.includes(module.id)
  const selected = selectedChoice === null ? null : module.choices[selectedChoice]

  const selectModule = (index: number) => {
    setActiveIndex(index)
    setSelectedChoice(null)
  }

  const completeCurrent = () => {
    if (!selected?.correct) return
    progress.completeModule(module.id)
    const nextIndex = earthTrainingModules.findIndex((item, index) => index > activeIndex && !progress.earthModulesCompleted.includes(item.id))
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex)
      setSelectedChoice(null)
    }
  }

  if (!progress.astronautRole) {
    const roles: Array<{ id: AstronautRole; title: string; description: string; Icon: typeof Compass }> = [
      { id: 'navigation', title: 'Navigation', description: 'Aime lire les cartes et planifier les trajets.', Icon: Compass },
      { id: 'ingenierie', title: 'Ingénierie', description: 'Aime comprendre les machines et réparer.', Icon: Wrench },
      { id: 'sciences', title: 'Sciences', description: 'Aime observer, poser des questions et faire des expériences.', Icon: FlaskConical },
    ]
    return (
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <Link to="/levels" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"><ArrowLeft size={16} /> Retour à la carte</Link>
        <section className="mt-7 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-9">
          <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-300">Niveau 1 · Première étape</p>
          <h1 className="mt-2 text-3xl font-black text-white">Sélection de l’astronaute junior</h1>
          <p className="mt-3 leading-7 text-slate-300">Choisis ton nom d’équipage et le domaine que tu aimerais explorer. Tous les rôles sont importants et l’équipage réussit grâce à la coopération.</p>
          <label htmlFor="astronaut-name" className="mt-6 block text-sm font-bold text-slate-200">Nom d’astronaute</label>
          <div className="mt-2 flex max-w-md items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4"><UserRound size={18} className="text-cyan-300" /><input id="astronaut-name" value={astronautName} onChange={(event) => setAstronautName(event.target.value)} maxLength={24} placeholder="Ex. Alex" className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-500" /></div>
          <h2 className="mt-7 text-lg font-black text-white">Choisis un domaine à découvrir</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {roles.map(({ id, title, description, Icon }) => <button key={id} onClick={() => setAstronautRole(id)} className={`rounded-2xl border p-4 text-left transition ${astronautRole === id ? 'border-cyan-300 bg-cyan-950/50' : 'border-slate-700 bg-slate-950/60 hover:border-slate-500'}`}><Icon size={23} className="text-cyan-300" /><span className="mt-3 block font-black text-white">{title}</span><span className="mt-1 block text-sm leading-5 text-slate-300">{description}</span></button>)}
          </div>
          <button disabled={!astronautName.trim() || !astronautRole} onClick={() => progress.selectAstronaut(astronautName.trim(), astronautRole!)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">Commencer la formation <ArrowRight size={17} /></button>
        </section>
      </main>
    )
  }

  return (
    <main className="space-bg-animated mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl px-5 py-8 sm:px-8">
      <Link to="/levels" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"><ArrowLeft size={16} /> Retour à la carte</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-300">Niveau 1 · Terre</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">École des astronautes juniors</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">Avant le départ, découvre les bases de la mission et entraîne-toi à prendre soin de toi et de ton équipage.</p>
          <p className="mt-2 text-sm font-bold text-cyan-200">Astronaute junior : {progress.astronautName} · Domaine : {progress.astronautRole}</p>
        </div>
        <div className="rounded-2xl border border-cyan-900 bg-slate-900 px-4 py-3 text-sm font-bold text-cyan-100">
          Modules terminés : {progress.earthModulesCompleted.length}/{earthTrainingModules.length}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav aria-label="Modules de formation" className="space-y-2">
          {earthTrainingModules.map((item, index) => {
            const done = progress.earthModulesCompleted.includes(item.id)
            return (
              <button key={item.id} onClick={() => selectModule(index)} className={`academy-card flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${activeIndex === index ? 'border-cyan-300 bg-cyan-950/60' : 'border-slate-800 bg-slate-900 hover:border-slate-600'}`}>
                <span className="text-2xl" aria-hidden>{item.icon}</span>
                <span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase text-slate-400">Module {index + 1}</span><span className="block truncate text-sm font-bold text-white">{item.title}</span></span>
                {done && <Check size={17} className="shrink-0 text-emerald-300" aria-label="Terminé" />}
              </button>
            )
          })}
        </nav>

        <section className="animate-enter rounded-3xl border border-slate-700 bg-slate-900/90 p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="text-4xl" aria-hidden>{module.icon}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-cyan-300">Module {activeIndex + 1} sur {earthTrainingModules.length}</p>
              <h2 className="mt-1 text-2xl font-black text-white">{module.title}</h2>
              <p className="mt-2 text-sm font-bold text-slate-300">Objectif : {module.objective}</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-5 leading-7 text-slate-200">{module.lesson}</div>
          <div className="mt-7">
            <h3 className="flex items-center gap-2 text-lg font-black text-white"><CircleHelp size={19} className="text-yellow-300" /> Défi de formation</h3>
            <p className="mt-2 font-bold text-slate-200">{module.challenge}</p>
            <div className="mt-4 grid gap-3">
              {module.choices.map((choice, index) => {
                const chosen = selectedChoice === index
                const showCorrect = selectedChoice !== null && choice.correct
                const showWrong = chosen && !choice.correct
                return (
                  <button key={choice.label} onClick={() => !isComplete && setSelectedChoice(index)} disabled={isComplete} className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${showCorrect ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100' : showWrong ? 'border-rose-400 bg-rose-950/50 text-rose-100' : chosen ? 'border-cyan-300 bg-cyan-950/50 text-white' : 'border-slate-700 bg-slate-950/60 text-slate-200 hover:border-cyan-300'} disabled:cursor-default`}>
                    {choice.label}
                  </button>
                )
              })}
            </div>
            {selected && <p role="status" className={`mt-4 rounded-xl p-4 text-sm font-bold ${selected.correct ? 'bg-emerald-950/50 text-emerald-200' : 'bg-amber-950/50 text-amber-100'}`}>{selected.feedback}</p>}
            {isComplete ? (
              <p className="mt-5 inline-flex items-center gap-2 font-black text-emerald-300"><Check size={18} /> Module validé</p>
            ) : selected?.correct ? (
              <button onClick={completeCurrent} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-300">Valider le module <ArrowRight size={17} /></button>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-800 pt-5">
            <button onClick={() => selectModule(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-40">Précédent</button>
            {allComplete && <Link to="/exam/earth" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-400"><GraduationCap size={18} /> Passer l’examen de Terre</Link>}
            {!allComplete && <button onClick={() => selectModule(Math.min(earthTrainingModules.length - 1, activeIndex + 1))} disabled={activeIndex === earthTrainingModules.length - 1} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-40">Suivant <ArrowRight size={16} /></button>}
          </div>
        </section>
      </div>
      {allComplete && <p className="mt-6 rounded-2xl border border-emerald-700 bg-emerald-950/30 p-4 text-center font-bold text-emerald-200">Tous les modules sont validés. Réussis l’examen pour obtenir l’autorisation de départ !</p>}
    </main>
  )
}
