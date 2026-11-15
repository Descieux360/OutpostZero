import { LUNAR_SCENARIO } from '../../data/lunarScenario'
import { applyPlayerAction, type PlayerAction } from '../../domain/actions'
import { resolveEvent } from '../../domain/events'
import { advanceDay, createInitialMission, startMission } from '../../domain/simulation'
import type { MissionState } from '../../domain/types'

export type MissionAction =
  | { type: 'START' }
  | { type: 'ADVANCE_DAY' }
  | { type: 'RESTART' }
  | { type: 'APPLY_ACTION'; payload: PlayerAction }
  | { type: 'RESOLVE_EVENT'; choiceId: string }

export const initialMission = () => createInitialMission(LUNAR_SCENARIO)

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'START':
      return startMission(state)
    case 'ADVANCE_DAY':
      return advanceDay(state, LUNAR_SCENARIO) // no-op unless active: blocks double-resolution
    case 'RESTART':
      return initialMission()
    case 'APPLY_ACTION':
      return applyPlayerAction(state, action.payload)
    case 'RESOLVE_EVENT':
      return resolveEvent(state, action.choiceId)
  }
}
