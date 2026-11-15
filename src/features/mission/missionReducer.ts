import type { MissionState } from '../../domain/types';
import { createInitialMission, startMission, advanceDay } from '../../domain/simulation';
import { applyPlayerAction, type PlayerAction } from '../../domain/actions';
import { resolveEvent } from '../../domain/events';
import { LUNAR_SCENARIO } from '../../data/lunarScenario';

export const initialMission: MissionState = createInitialMission(LUNAR_SCENARIO);

export type MissionAction =
  | { type: 'START' }
  | { type: 'ADVANCE_DAY' }
  | { type: 'APPLY_ACTION'; payload: PlayerAction }
  | { type: 'RESOLVE_EVENT'; choiceId: string }
  | { type: 'RESTART'; seed?: number }
  | { type: 'DEBUG_JUMP_TO_DAY'; day: number };

export function missionReducer(
  state: MissionState,
  action: MissionAction
): MissionState {
  const config = LUNAR_SCENARIO;

  switch (action.type) {
    case 'START':
      return startMission(state);

    case 'ADVANCE_DAY':
      return advanceDay(state, config);

    case 'APPLY_ACTION':
      return applyPlayerAction(state, action.payload);

    case 'RESOLVE_EVENT':
      return resolveEvent(state, action.choiceId);

    case 'RESTART':
      return createInitialMission(config, action.seed);

    case 'DEBUG_JUMP_TO_DAY':
      return {
        ...state,
        day: Math.max(1, Math.min(config.totalDays, action.day)),
      };

    default:
      return state;
  }
}