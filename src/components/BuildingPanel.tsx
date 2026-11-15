import { MousePointerClick, Wrench } from 'lucide-react'
import type { Dispatch } from 'react'
import { canPerformAction, type ActionCheck, type PlayerAction } from '../domain/actions'
import type { MissionAction } from '../features/mission/missionReducer'
import type { MissionState, SystemConfig, SystemMode } from '../domain/types'
import { MockBadge } from './MockBadge'
import { StatusPill } from './StatusPill'

const modeLabel: Record<SystemMode, string> = { normal: 'Normal operation', conserve: 'Conserving', paused: 'Paused', damaged: 'Damaged' }
const selectableModes = [
  { mode: 'normal', label: 'Normal' },
  { mode: 'conserve', label: 'Conserve' },
  { mode: 'paused', label: 'Pause' },
] as const

interface Props {
  system: SystemConfig | null
  mode?: SystemMode
  state: MissionState
  dispatch: Dispatch<MissionAction>
}

function kidFriendlyReason(reason?: string) {
  if (!reason) return 'This action is unavailable right now.'
  if (reason.includes('15 Energy')) return 'You need 15 Energy to repair this system.'
  if (reason.includes('not currently damaged')) return 'This system is not damaged, so it does not need repairs.'
  if (reason.includes('damaged')) return 'This system is damaged. Repair it before changing modes.'
  if (reason.includes('already operating')) return 'This system is already using this mode.'
  if (reason.includes('space weather incident')) return 'Choose a response to the space-weather event first.'
  if (reason.includes('Mission is not')) return 'Start the mission before changing this system.'
  return reason
}

function ActionButton({
  action,
  check,
  dispatch,
  label,
  pressed,
}: {
  action: PlayerAction
  check: ActionCheck
  dispatch: Props['dispatch']
  label: string
  pressed?: boolean
}) {
  const reason = check.allowed ? undefined : kidFriendlyReason(check.reason)
  const tooltipId = `building-action-${action.systemId}-${action.type === 'SET_SYSTEM_MODE' ? action.mode : 'repair'}`

  return (
    <div
      className="group relative"
      tabIndex={check.allowed ? undefined : 0}
      title={reason}
      aria-describedby={reason ? tooltipId : undefined}
    >
      <button
        type="button"
        disabled={!check.allowed}
        aria-pressed={pressed}
        aria-describedby={reason ? tooltipId : undefined}
        className="w-full rounded-md border border-line bg-vacuum px-3 py-2 text-sm font-semibold text-regolith transition-colors hover:border-nominal hover:text-nominal disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => dispatch({ type: 'APPLY_ACTION', payload: action })}
      >
        {label}
      </button>
      {reason && (
        <span
          id={tooltipId}
          role="tooltip"
          className="invisible absolute bottom-full left-0 z-10 mb-2 w-56 rounded-md border border-line bg-deck p-2 text-xs font-normal text-regolith opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        >
          {reason}
        </span>
      )}
    </div>
  )
}

export function BuildingPanel({ system, mode, state, dispatch }: Props) {
  if (!system || !mode) {
    return (
      <section className="rounded-lg border border-line bg-deck p-5" aria-live="polite">
        <p className="flex items-center gap-2 text-dust"><MousePointerClick size={16} aria-hidden /> Select a building on the map to see what it does.</p>
      </section>
    )
  }
  const fx = system.effectsByMode[mode] ?? {}
  const tone = mode === 'damaged' ? 'critical' : mode === 'normal' ? 'nominal' : 'caution'
  const modeActions = selectableModes.map(({ mode: targetMode, label }) => {
    const action: PlayerAction = { type: 'SET_SYSTEM_MODE', systemId: system.id, mode: targetMode }
    return {
      action,
      check: canPerformAction(state, action),
      label,
      pressed: mode === targetMode,
    }
  })
  const repairAction: PlayerAction = { type: 'REPAIR_SYSTEM', systemId: system.id }
  const repairCheck = canPerformAction(state, repairAction)

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
      <div className="mt-5 border-t border-line pt-4">
        <h3 className="text-sm font-semibold text-regolith">System controls</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {modeActions.map(({ action, check, label, pressed }) => (
            <ActionButton
              key={label}
              action={action}
              check={check}
              dispatch={dispatch}
              label={label}
              pressed={pressed}
            />
          ))}
        </div>
        <div className="mt-2">
          <ActionButton
            action={repairAction}
            check={repairCheck}
            dispatch={dispatch}
            label={`Repair · 15 Energy`}
          />
        </div>
        {repairCheck.allowed && (
          <p className="mt-2 flex items-center gap-1 text-xs text-caution">
            <Wrench size={12} aria-hidden /> Repair restores this system to normal operation.
          </p>
        )}
      </div>
    </section>
  )
}
