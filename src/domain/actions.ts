import type { MissionState, SystemId, SystemMode } from './types';

export type PlayerAction =
  | { type: 'SET_SYSTEM_MODE'; systemId: SystemId; mode: SystemMode }
  | { type: 'REPAIR_SYSTEM'; systemId: SystemId };

export interface ActionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates whether a player action can be taken in the current mission state.
 */
export function canPerformAction(state: MissionState, action: PlayerAction): ActionCheck {
  if (state.missionStatus !== 'active') {
    return { allowed: false, reason: 'Mission is not currently active.' };
  }
  if (state.pendingEventId) {
    return { allowed: false, reason: 'Resolve the current space weather incident first!' };
  }

  switch (action.type) {
    case 'SET_SYSTEM_MODE': {
      const currentMode = state.systemModes[action.systemId];
      if (currentMode === 'damaged') {
        return { allowed: false, reason: 'System is damaged and must be repaired first!' };
      }
      if (currentMode === action.mode) {
        return { allowed: false, reason: `System is already operating in ${action.mode} mode.` };
      }
      return { allowed: true };
    }

    case 'REPAIR_SYSTEM': {
      const currentMode = state.systemModes[action.systemId];
      if (currentMode !== 'damaged') {
        return { allowed: false, reason: 'System is not currently damaged.' };
      }
      if (state.resources.energy < 15) {
        return { allowed: false, reason: 'Requires at least 15 Energy to perform emergency repairs.' };
      }
      return { allowed: true };
    }

    default:
      return { allowed: false, reason: 'Unknown action type.' };
  }
}

/**
 * Applies a player action to update system modes and resources.
 */
export function applyPlayerAction(state: MissionState, action: PlayerAction): MissionState {
  const check = canPerformAction(state, action);
  if (!check.allowed) return state;

  switch (action.type) {
    case 'SET_SYSTEM_MODE': {
      const logEntry = `Day ${state.day}: Set ${action.systemId.toUpperCase()} to ${action.mode.toUpperCase()} mode.`;
      return {
        ...state,
        systemModes: {
          ...state.systemModes,
          [action.systemId]: action.mode,
        },
        eventLog: [logEntry, ...state.eventLog],
      };
    }

    case 'REPAIR_SYSTEM': {
      const logEntry = `Day ${state.day}: Repaired ${action.systemId.toUpperCase()} system back to NORMAL (-15 Energy).`;
      return {
        ...state,
        systemModes: {
          ...state.systemModes,
          [action.systemId]: 'normal',
        },
        resources: {
          ...state.resources,
          energy: Math.max(0, state.resources.energy - 15),
        },
        eventLog: [logEntry, ...state.eventLog],
      };
    }

    default:
      return state;
  }
}