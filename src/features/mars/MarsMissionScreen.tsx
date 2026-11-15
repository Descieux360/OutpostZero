import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ArrowRight, BatteryCharging, Droplets, HeartHandshake, Leaf, RotateCcw, Shield, Wind } from 'lucide-react'
import { useAcademyProgress } from '../academy/AcademyProgressContext'

type MarsResources = { energy: number; oxygen: number; water: number; food: number; morale: number }
type MarsActionId = 'solar' | 'recycle' | 'greenhouse' | 'team'

const actions: Array<{ id: MarsActionId; title: string; description: string; icon: typeof BatteryCharging }> = [
  { id: 'solar', title: 'Gérer l’énergie solaire', description: 'Recharge les batteries. La poussière réduit la production au jour 3.', icon: BatteryCharging },
  { id: 'recycle', title: 'Recycler l’eau et l’air', description: 'Consomme de l’énergie pour récupérer de l’eau et un peu d’oxygène.', icon: Droplets },
  { id: 'greenhouse', title: 'S’occuper de la serre', description: 'Utilise de l’eau et de l’énergie pour produire de la nourriture.', icon: Leaf },
  { id: 'team', title: 'Prendre soin de l’équipage', description: 'Se parler, s’écouter et partager les tâches améliore le moral.', icon: HeartHandshake },
]

const initialResources: MarsResources = { energy: 78, oxygen: 72, water: 68, food: 70, morale: 72 }

function clamp(value: number) { return Math.max(0, Math.min(100, value)) }

export function MarsMissionScreen() {
  const progress = useAcademyProgress()
  const navigate = useNavigate()
  const [day, setDay] = useState(1)
  const [resources, setResources] = useState<MarsResources>(initialResources)
  const [message, setMessage] = useState('Choisis une priorité pour cette journée martienne.')
  const [outcome, setOutcome] = useState<'success' | 'failed' | null>(null)

  if (!progress.moonPassed) return <main className="mx-auto max-w-2xl px-5 py-16"><h1 className="text-3xl font-black text-white">Mars est encore verrouillée</h1><p className="mt-3 text-slate-300">Réussis la mission lunaire et son examen pour continuer.</p><Link to="/levels" className="mt-5 inline-block text-cyan-300">Retour à la carte</Link></main>

  const restart = () => {
    setDay(1)
    setResources(initialResources)
    setOutcome(null)
    setMessage('Choisis une priorité pour cette journée martienne.')
  }

  const chooseAction = (actionId: MarsActionId) => {
    if (outcome) return
    let next = { ...resources }
    let actionText = ''
    switch (actionId) {
      case 'solar':
        next.energy += day === 3 ? 10 : 24
        actionText = day === 3 ? 'La poussière a réduit la recharge solaire.' : 'Les batteries ont été rechargées.'
        break
      case 'recycle':
        if (next.energy < 10) { setMessage('Énergie insuffisante pour faire fonctionner le recyclage. Choisis une autre priorité.'); return }
        next.energy -= 10; next.water += 13; next.oxygen += 3
        actionText = 'Le recyclage a récupéré de l’eau et de l’oxygène.'
        break
      case 'greenhouse':
        if (next.energy < 12 || next.water < 7) { setMessage('La serre a besoin d’au moins 12 unités d’énergie et 7 d’eau. Choisis une autre priorité.'); return }
        next.energy -= 12; next.water -= 7; next.food += 16; next.oxygen += 2
        actionText = 'La serre a produit de la nourriture.'
        break
      case 'team':
        if (next.energy < 5) { setMessage('Il faut un peu d’énergie pour la réunion d’équipage. Choisis une autre priorité.'); return }
        next.energy -= 5; next.morale += 22
        actionText = 'L’équipage a partagé ses préoccupations et réparti les tâches.'
        break
    }

    // Daily needs: simplified game units, not real mission figures.
    next.energy -= 8
    next.oxygen -= 7
    next.water -= 6
    next.food -= 7
    next.morale -= 4
    next = {
      energy: clamp(next.energy), oxygen: clamp(next.oxygen), water: clamp(next.water),
      food: clamp(next.food), morale: clamp(next.morale),
    }
    setResources(next)

    if (Object.values(next).some((value) => value <= 0)) {
      setOutcome('failed')
      setMessage(`${actionText} Mais une réserve ou le moral de l’équipage est tombé à zéro. Recommence en équilibrant les besoins.`)
      return
    }
    if (day === 5) {
      setOutcome('success')
      setMessage(`${actionText} L’équipage a terminé les cinq jours de mission martienne !`)
      progress.completeMarsMission()
      return
    }
    setMessage(`${actionText} Les besoins quotidiens sont déduits. Prépare maintenant le jour ${day + 1}.`)
    setDay((current) => current + 1)
  }

  const meters: Array<{ key: keyof MarsResources; label: string; icon: typeof Wind }> = [
    { key: 'energy', label: 'Énergie', icon: BatteryCharging },
    { key: 'oxygen', label: 'Oxygène', icon: Wind },
    { key: 'water', label: 'Eau', icon: Droplets },
    { key: 'food', label: 'Nourriture', icon: Leaf },
    { key: 'morale', label: 'Moral', icon: HeartHandshake },
  ]

  return (
    <main className="space-bg-animated mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl px-5 py-8 sm:px-8">
      <Link to="/levels" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"><ArrowLeft size={16} /> Retour à la carte</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-black uppercase tracking-[.2em] text-orange-300">Niveau 3 · Mars</p><h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Survie sur Mars</h1><p className="mt-3 max-w-2xl leading-7 text-slate-300">Tiens cinq jours, garde les ressources au-dessus de zéro et prends soin de l’équipage.</p></div>
        <div className="rounded-2xl border border-orange-900 bg-slate-900 px-4 py-3 text-sm font-black text-orange-100">Jour {day} / 5</div>
      </div>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {meters.map(({ key, label, icon: Icon }) => <div key={key} className="rounded-2xl border border-slate-700 bg-slate-900 p-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-300"><Icon size={17} className="text-orange-300" />{label}</div><div className="mt-2 text-2xl font-black text-white">{resources[key]}<span className="ml-1 text-xs text-slate-400">/ 100</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800"><div className={`resource-bar-fill h-full rounded-full ${resources[key] < 30 ? 'bg-rose-400' : 'bg-orange-400'}`} style={{ width: `${resources[key]}%` }} /></div></div>)}
      </section>

      <div className="animate-enter mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-5 sm:p-7">
          <div className={`rounded-2xl border border-orange-700/50 bg-orange-950/30 p-4 ${day === 3 ? 'dust-alert' : ''}`}><div className="flex items-center gap-2 font-black text-orange-200"><Shield size={18} /> Point de situation</div><p className="mt-2 text-sm leading-6 text-slate-200">{day === 3 ? 'Une forte poussière martienne est prévue aujourd’hui : la recharge solaire sera moins efficace. Choisis ta priorité avec soin.' : 'Les ressources diminuent chaque jour. Les systèmes, la production alimentaire et le bien-être de l’équipage sont liés.'}</p></div>
          <h2 className="mt-6 text-xl font-black text-white">Quelle est ta priorité aujourd’hui ?</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{actions.map(({ id, title, description, icon: Icon }) => <button key={id} onClick={() => chooseAction(id)} disabled={!!outcome} className="academy-card rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-left transition hover:border-orange-300 hover:bg-orange-950/30 disabled:cursor-not-allowed disabled:opacity-60"><span className="flex items-center gap-2 font-black text-white"><Icon size={18} className="text-orange-300" />{title}</span><span className="mt-2 block text-sm leading-6 text-slate-300">{description}</span></button>)}</div>
          <p role="status" className="mt-5 rounded-xl bg-slate-950 p-4 text-sm font-bold text-slate-200">{message}</p>
          {outcome === 'success' && <div className="mt-5 rounded-2xl border border-emerald-700 bg-emerald-950/30 p-5"><h3 className="text-xl font-black text-emerald-200">Mission réussie !</h3><p className="mt-2 text-sm text-slate-200">Passe le test de connaissances pour terminer ton niveau martien.</p><button onClick={() => navigate('/exam/mars')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-black text-slate-950">Passer le test <ArrowRight size={17} /></button></div>}
          {outcome === 'failed' && <div className="mt-5 rounded-2xl border border-rose-700 bg-rose-950/30 p-5"><h3 className="text-xl font-black text-rose-200">La mission doit être recommencée</h3><p className="mt-2 text-sm text-slate-200">Essaie de varier tes priorités : recharge, recyclage, serre et entraide.</p><button onClick={restart} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-black text-white"><RotateCcw size={17} /> Recommencer</button></div>}
        </section>
        <aside className="rounded-3xl border border-slate-700 bg-slate-900 p-5"><h2 className="font-black text-white">Compromis de mission</h2><ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300"><li><strong className="text-white">Recyclage :</strong> économise de l’eau, mais utilise de l’énergie.</li><li><strong className="text-white">Serre :</strong> produit de la nourriture, mais demande de l’eau et de l’énergie.</li><li><strong className="text-white">Équipage :</strong> le moral compte aussi ; s’écouter et s’entraider aide la mission.</li></ul><p className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-400">Unités de jeu simplifiées à des fins éducatives. Ce simulateur ne donne pas de consignes réelles de sécurité spatiale.</p></aside>
      </div>
    </main>
  )
}
