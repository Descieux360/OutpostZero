import type { CrewCondition, MissionConfig, MissionState, Resources } from './types'
import { crewUse } from '../data/lunarScenario'

/** Pure functions: no React, no DOM. Safe to unit test later. */

export function createInitialMission(config: MissionConfig): MissionState {
  const resources = Object.fromEntries(config.resources.map((r) => [r.id, r.start])) as Resources
  return {
    day: 1,
    resources,
    crewCondition: 'stable',
    missionStatus: 'briefing',
    systemModes: { solar: 'normal', habitat: 'normal', greenhouse: 'normal' },
    eventLog: ['Mission created. Day 1 is ready.'],
    history: [{ day: 0, resources }],
  }
}

export function startMission(state: MissionState): MissionState {
  return state.missionStatus === 'briefing' ? { ...state, missionStatus: 'active' } : state
}

export function assessCrew(resources: Resources, config: MissionConfig): CrewCondition {
  if (config.resources.some((r) => resources[r.id] <= 0)) return 'critical'
  if (config.resources.some((r) => resources[r.id] < r.warnBelow)) return 'at-risk'
  return 'stable'
}

/** Resolves ONE day. Returns the same state if the mission is not active. */
export function advanceDay(state: MissionState, config: MissionConfig): MissionState {
  if (state.missionStatus !== 'active') return state
  if (state.pendingEventId) return state // incidents will gate advancement (spec 8.3)

  const next: Resources = { ...state.resources }
  const apply = (fx: Partial<Resources> = {}) => {
    for (const key of Object.keys(fx) as (keyof Resources)[]) next[key] += fx[key] ?? 0
  }

  // Production and system effects, then crew consumption (spec 5.4 order, simplified).
  for (const sys of config.systems) apply(sys.effectsByMode[state.systemModes[sys.id]])
  apply(crewUse)

  for (const r of config.resources) next[r.id] = Math.min(r.max, Math.max(0, next[r.id]))

  const crewCondition = assessCrew(next, config)
  const day = state.day
  const failed = crewCondition === 'critical'
  const completed = !failed && day >= config.totalDays

  return {
    ...state,
    day: completed || failed ? day : day + 1,
    resources: next,
    crewCondition,
    missionStatus: failed ? 'failed' : completed ? 'completed' : 'active',
    eventLog: [...state.eventLog, `Day ${day} resolved. Crew condition: ${crewCondition}.`],
    history: [...state.history, { day, resources: next }],
  }
}
