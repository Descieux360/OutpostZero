import { useState } from 'react'
import { ChevronsRight, RotateCcw } from 'lucide-react'
import { LUNAR_SCENARIO as cfg } from '../../data/lunarScenario'
import { sources } from '../../data/sources'
import { getEventForDay } from '../../domain/events'
import type { MissionState, SystemId } from '../../domain/types'
import { BuildingPanel } from '../../components/BuildingPanel'
import { IncidentModal } from '../../components/IncidentModal'
import { MissionTimeline } from '../../components/MissionTimeline'
import { MockBadge } from '../../components/MockBadge'
import { OutpostMap } from '../../components/OutpostMap'
import { ResourceCard } from '../../components/ResourceCard'
import { StatusPill } from '../../components/StatusPill'
import type { MissionAction } from './missionReducer'

interface Props { state: MissionState; dispatch: (a: MissionAction) => void }

export function MissionPage({ state, dispatch }: Props) {
  const [selected, setSelected] = useState<SystemId | null>(null)
  const finished = state.missionStatus === 'completed' || state.missionStatus === 'failed'
  const prev = state.history.length > 1 ? state.history[state.history.length - 2].resources : undefined
  const crewTone = state.crewCondition === 'stable' ? 'nominal' : state.crewCondition === 'at-risk' ? 'caution' : 'critical'
  const crewText = { stable: 'Crew stable', 'at-risk': 'Crew at risk', critical: 'Crew critical' }[state.crewCondition]
  const system = cfg.systems.find((s) => s.id === selected) ?? null
  const pendingIncident = state.pendingEventId ? getEventForDay(state.day, state) : null
  const incident = pendingIncident?.id === state.pendingEventId ? pendingIncident : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {incident && <IncidentModal incident={incident} dispatch={dispatch} />}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Outpost Zero</h1>
          <p className="text-sm text-dust">{cfg.name} · Day {state.day} of {cfg.totalDays}</p>
        </div>
        <div className="flex items-center gap-3"><MockBadge label="Mock scenario" /><StatusPill tone={crewTone}>{crewText}</StatusPill></div>
      </header>

      <div className="mt-5"><MissionTimeline config={cfg} day={state.day} finished={finished} /></div>

      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Resources">
        {cfg.resources.map((r) => (
          <ResourceCard key={r.id} config={r} value={state.resources[r.id]} delta={prev ? state.resources[r.id] - prev[r.id] : undefined} />
        ))}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <OutpostMap modes={state.systemModes} selected={selected} onSelect={setSelected} />
        <BuildingPanel system={system} mode={system ? state.systemModes[system.id] : undefined} state={state} dispatch={dispatch} />
      </div>

      <section className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-deck p-4">
        <div aria-live="polite">
          {state.missionStatus === 'completed' && <p className="font-semibold text-nominal">Mission complete. Full debrief screen is not built yet (placeholder).</p>}
          {state.missionStatus === 'failed' && <p className="font-semibold text-critical">Mission failed on Day {state.day}. Full debrief screen is not built yet (placeholder).</p>}
          {!finished && <p className="text-sm text-dust">Resolve Day {state.day}: production, consumption, then crew assessment.</p>}
        </div>
        <div className="flex gap-2">
          {finished ? (
            <button onClick={() => dispatch({ type: 'RESTART' })} className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 font-semibold hover:bg-deck-raised">
              <RotateCcw size={16} aria-hidden /> Restart mission
            </button>
          ) : (
            <button disabled={Boolean(state.pendingEventId)} onClick={() => dispatch({ type: 'ADVANCE_DAY' })} className="inline-flex items-center gap-2 rounded-md bg-nominal px-5 py-2.5 font-semibold text-vacuum hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              Advance day <ChevronsRight size={18} aria-hidden />
            </button>
          )}
        </div>
      </section>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <section className="rounded-lg border border-line bg-deck p-4">
          <h2 className="font-semibold text-white">Event log</h2>
          <ol className="mt-2 max-h-40 space-y-1 overflow-auto text-sm">
            {[...state.eventLog].reverse().filter((l) => !l.startsWith('Event ') || !l.endsWith(' resolved')).map((l, i) => <li key={i}>{l}</li>)}
          </ol>
        </section>
        <section className="rounded-lg border border-line bg-deck p-4">
          <h2 className="font-semibold text-white">Sources and assumptions</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {sources.map((s, i) => <li key={i}><span className="text-caution">Game assumption.</span> {s.text}</li>)}
          </ul>
          <p className="mt-2 text-xs text-dust">No NASA data or imagery is used yet. Attributed material will be added when verified.</p>
        </section>
      </div>
    </div>
  )
}
