import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, Droplets, Flag, Utensils, Wind, Zap, type LucideIcon } from 'lucide-react'
import type { MissionState } from '../domain/types'

interface CheckpointModalProps {
  state: MissionState
  onDismiss: () => void
}

export function CheckpointModal({ state, onDismiss }: CheckpointModalProps) {
  const checkpointDay = state.day - 1

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const metrics: Array<{ label: string; value: number; unit: string; icon: LucideIcon; color: string }> = [
    { label: 'Energy reserves', value: state.resources.energy, unit: 'kWh', icon: Zap, color: 'text-amber-400' },
    { label: 'Water supply', value: state.resources.water, unit: 'L', icon: Droplets, color: 'text-blue-400' },
    { label: 'Oxygen supply', value: state.resources.oxygen, unit: 'L', icon: Wind, color: 'text-sky-400' },
    { label: 'Food rations', value: state.resources.food, unit: 'rations', icon: Utensils, color: 'text-emerald-400' },
  ]

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <section
        aria-labelledby="checkpoint-title"
        aria-modal="true"
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border-2 border-[var(--color-line)] bg-[var(--color-deck)] p-5 text-center text-[var(--color-regolith)] shadow-2xl sm:p-6"
        role="dialog"
      >
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-action)]/40 bg-[var(--color-action)]/20 text-[var(--color-action)] shadow-lg">
          <Flag className="h-7 w-7" aria-hidden />
        </div>

        <h2 id="checkpoint-title" className="text-2xl font-black text-white">
          Mission checkpoint · Day {checkpointDay}
        </h2>
        <p className="mb-5 mt-2 text-sm font-bold text-[var(--color-dust)]">
          Great work! Here’s how your moonbase is doing so far.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {metrics.map(({ label, value, unit, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-3.5">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <Icon className={`h-3.5 w-3.5 ${color}`} aria-hidden />
                {label}
              </div>
              <div className="text-xl font-black text-white">
                {value} <span className="text-xs font-semibold text-slate-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="btn-chunky flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-nominal)] py-3.5 text-base font-black text-white shadow-lg transition hover:brightness-110"
        >
          <span>Continue the mission</span>
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </section>
    </div>,
    document.body,
  )
}
