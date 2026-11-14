import { lunarScenario } from '../../data/lunarScenario'
import { advanceDay, createInitialMission, startMission } from '../../domain/simulation'
import type { MissionState } from '../../domain/types'

export type MissionAction = { type: 'START' } | { type: 'ADVANCE_DAY' } | { type: 'RESTART' }

export const initialMission = () => createInitialMission(lunarScenario)

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {
    case 'START':
      return startMission(state)
    case 'ADVANCE_DAY':
      return advanceDay(state, lunarScenario) // no-op unless active: blocks double-resolution
    case 'RESTART':
      return initialMission()
  }
}
