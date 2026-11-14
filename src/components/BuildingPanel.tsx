import { MousePointerClick } from 'lucide-react'
import type { SystemConfig, SystemMode } from '../domain/types'
import { MockBadge } from './MockBadge'
import { StatusPill } from './StatusPill'

const modeLabel: Record<SystemMode, string> = { normal: 'Normal operation', conserve: 'Conserving', paused: 'Paused', damaged: 'Damaged' }

export function BuildingPanel({ system, mode }: { system: SystemConfig | null; mode?: SystemMode }) {
  if (!system || !mode) {
    return (
      <section className="rounded-lg border border-line bg-deck p-5" aria-live="polite">
        <p className="flex items-center gap-2 text-dust"><MousePointerClick size={16} aria-hidden /> Select a building on the map to see what it does.</p>
      </section>
    )
  }
  const fx = system.effectsByMode[mode] ?? {}
  const tone = mode === 'damaged' ? 'critical' : mode === 'normal' ? 'nominal' : 'caution'
  return (
    <section className="rounded-lg border border-line bg-deck p-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">{system.name}</h2>
        <StatusPill tone={tone}>{modeLabel[mode]}</StatusPill>
      </div>
      <p className="mt-1 text-sm text-dust">{system.role}</p>
      <p className="mt-3 max-w-prose text-sm leading-relaxed">{system.explainer}</p>
      <h3 className="mt-4 flex items-center gap-2 text-sm font-semibold text-regolith">Daily effect <MockBadge label="Game units, mock values" /></h3>
      <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">
        {Object.entries(fx).map(([k, v]) => (
          <li key={k} className="flex justify-between rounded bg-vacuum px-2 py-1">
            <span className="capitalize">{k}</span>
            <span className={v < 0 ? 'text-caution' : 'text-nominal'}>{v > 0 ? '+' : ''}{v}</span>
          </li>
        ))}
        {Object.keys(fx).length === 0 && <li className="col-span-2 text-dust">No effect in this mode.</li>}
      </ul>
      <p className="mt-4 rounded border border-dashed border-line p-2 text-xs text-dust">Placeholder: player actions (conserve, repair, pause) are not built yet.</p>
    </section>
  )
}
