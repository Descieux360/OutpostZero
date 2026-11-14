import { ArrowRight, Info } from 'lucide-react'
import { lunarScenario as cfg } from '../../data/lunarScenario'
import { MockBadge } from '../../components/MockBadge'

export function BriefingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold text-white">Mission briefing</h1>
      <p className="mt-2 text-dust">Destination: Moon. {cfg.name}.</p>

      <p className="mt-6 max-w-prose text-lg leading-relaxed">
        <strong className="text-white">Objective:</strong> keep the outpost operational for {cfg.totalDays} simulated days with the crew above Critical.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-white">Four resources <MockBadge label="Mock starting values" /></h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {cfg.resources.map((r) => (
              <li key={r.id} className="flex justify-between rounded border border-line bg-deck px-3 py-2">
                <span>{r.label}</span><span className="text-dust">starts at {r.start} units</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white">Three systems</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {cfg.systems.map((s) => (
              <li key={s.id} className="rounded border border-line bg-deck px-3 py-2">
                <span className="font-medium text-regolith">{s.name}</span>
                <span className="block text-dust">{s.role}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white">Crew condition</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed">
          Stable means all resources are healthy. At Risk means one is running low. Critical means one has run out, and the mission fails.
        </p>
      </section>

      <p className="mt-8 flex max-w-prose items-start gap-2 rounded border border-dashed border-caution/60 p-3 text-sm text-caution">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
        All quantities are game units, not real engineering values. This is a simplified educational simulation.
      </p>

      <button onClick={onBegin} className="mt-8 inline-flex items-center gap-2 rounded-md bg-nominal px-5 py-3 font-semibold text-vacuum hover:brightness-110">
        Begin mission <ArrowRight size={18} aria-hidden />
      </button>
    </main>
  )
}
