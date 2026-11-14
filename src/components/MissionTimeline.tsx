import { Flag, Zap } from 'lucide-react'
import type { MissionConfig } from '../domain/types'

export function MissionTimeline({ config, day, finished }: { config: MissionConfig; day: number; finished: boolean }) {
  return (
    <ol className="grid grid-cols-7 gap-1.5" aria-label="Mission timeline">
      {Array.from({ length: config.totalDays }, (_, i) => i + 1).map((d) => {
        const incident = config.incidents.find((x) => x.day === d)
        const done = d < day || (finished && d === day)
        const current = d === day && !finished
        return (
          <li key={d} aria-current={current ? 'step' : undefined} className={`rounded border px-1.5 py-2 text-center text-xs ${current ? 'border-nominal bg-nominal/10 text-white' : done ? 'border-line bg-deck-raised text-regolith' : 'border-line text-dust'}`}>
            <span className="block font-semibold">Day {d}</span>
            <span className="mt-1 flex min-h-4 items-center justify-center gap-1 text-[11px] text-caution">
              {incident ? <><Zap size={11} aria-hidden /> <span className="hidden sm:inline">{incident.title}</span><span className="sm:hidden">Event</span></> : d === config.totalDays ? <Flag size={11} className="text-dust" aria-hidden /> : null}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
