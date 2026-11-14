import { BatteryCharging, Drumstick, Droplets, Wind } from 'lucide-react'
import type { ResourceConfig, ResourceName } from '../domain/types'
import { StatusPill } from './StatusPill'

const icons: Record<ResourceName, typeof Wind> = {
  energy: BatteryCharging,
  oxygen: Wind,
  water: Droplets,
  food: Drumstick,
}

export function ResourceCard({ config, value, delta }: { config: ResourceConfig; value: number; delta?: number }) {
  const Icon = icons[config.id]
  const pct = Math.round((value / config.max) * 100)
  const tone = value <= 0 ? 'critical' : value < config.warnBelow ? 'caution' : 'nominal'
  const bar = { nominal: 'bg-nominal', caution: 'bg-caution', critical: 'bg-critical' }[tone]
  return (
    <div className="rounded-lg border border-line bg-deck p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-regolith">
          <Icon size={16} className="text-dust" aria-hidden /> {config.label}
        </h3>
        <StatusPill tone={tone}>{tone === 'nominal' ? 'Stable' : tone === 'caution' ? 'Low' : 'Empty'}</StatusPill>
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
        <span className="ml-1 text-sm font-normal text-dust">/ {config.max} units</span>
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded bg-vacuum" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={config.max} aria-label={config.label}>
        <div className={`h-full ${bar} transition-[width] duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-dust">
        {delta === undefined ? 'No change recorded yet' : `${delta >= 0 ? '+' : ''}${delta} since last day`}
      </p>
    </div>
  )
}
