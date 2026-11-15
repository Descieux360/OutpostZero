import { ArrowRight, Info } from 'lucide-react'
import { LUNAR_SCENARIO as cfg } from '../../data/lunarScenario'
import { MockBadge } from '../../components/MockBadge'

export function BriefingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-black uppercase tracking-[.2em] text-cyan-300">Niveau 2 · Survie sur la Lune</p>
      <h1 className="mt-2 text-4xl font-bold text-white">Briefing de mission</h1>
      <p className="mt-2 text-dust">Destination : la Lune. {cfg.name}.</p>
      <p className="mt-6 max-w-prose text-lg leading-relaxed"><strong className="text-white">Objectif :</strong> maintenir l’avant-poste en fonctionnement pendant {cfg.totalDays} jours simulés et garder l’équipage hors de l’état critique.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section><h2 className="text-lg font-semibold text-white">Quatre ressources <MockBadge label="Valeurs de départ simulées" /></h2><ul className="mt-3 space-y-1.5 text-sm">{cfg.resources.map((r) => <li key={r.id} className="flex justify-between rounded border border-line bg-deck px-3 py-2"><span>{r.label}</span><span className="text-dust">Départ : {r.start} unités</span></li>)}</ul></section>
        <section><h2 className="text-lg font-semibold text-white">Trois systèmes</h2><ul className="mt-3 space-y-1.5 text-sm">{cfg.systems.map((s) => <li key={s.id} className="rounded border border-line bg-deck px-3 py-2"><span className="font-medium text-regolith">{s.name}</span><span className="block text-dust">{s.role}</span></li>)}</ul></section>
      </div>
      <section className="mt-8"><h2 className="text-lg font-semibold text-white">État de l’équipage</h2><p className="mt-2 max-w-prose text-sm leading-relaxed">Stable : les ressources sont suffisantes. À surveiller : une ressource diminue. Critique : une ressource est épuisée et la mission échoue.</p></section>
      <p className="mt-8 flex max-w-prose items-start gap-2 rounded border border-dashed border-caution/60 p-3 text-sm text-caution"><Info size={16} className="mt-0.5 shrink-0" aria-hidden />Toutes les quantités sont des unités de jeu simplifiées, pas des mesures réelles ni des consignes de mission.</p>
      <button onClick={onBegin} className="mt-8 inline-flex items-center gap-2 rounded-md bg-nominal px-5 py-3 font-semibold text-vacuum hover:brightness-110">Commencer la mission <ArrowRight size={18} aria-hidden /></button>
    </main>
  )
}
