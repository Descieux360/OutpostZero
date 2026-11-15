import type { MissionState, SystemId } from './types';

export type PlayerAction =
  | { type: 'REPAIR_SYSTEM'; systemId: SystemId }
  | { type: 'CLEAN_SOLAR_PANELS' }
  | { type: 'ROVER_COLLECT_SAMPLES' }
  | { type: 'COMMS_TRANSMIT_REPORT' };

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
  if (state.actionsLeft <= 0) {
    return { allowed: false, reason: 'No actions remaining today! Click Advance Day to continue.' };
  }

  switch (action.type) {
    case 'REPAIR_SYSTEM': {
      const currentMode = state.systemModes[action.systemId];
      if (currentMode !== 'damaged') {
        return { allowed: false, reason: 'System is running normally and does not need repair.' };
      }
      if (state.resources.energy < 15) {
        return { allowed: false, reason: 'Requires 15 Energy to complete emergency repairs.' };
      }
      return { allowed: true };
    }

    case 'CLEAN_SOLAR_PANELS': {
      if (state.resources.energy < 5) {
        return { allowed: false, reason: 'Requires 5 Energy to vibrate dust off panels.' };
      }
      return { allowed: true };
    }

    case 'ROVER_COLLECT_SAMPLES': {
      if (state.resources.energy < 20) {
        return { allowed: false, reason: 'Requires 20 Energy to dispatch the rover.' };
      }
      return { allowed: true };
    }

    case 'COMMS_TRANSMIT_REPORT': {
      if (state.resources.energy < 15) {
        return { allowed: false, reason: 'Requires 15 Energy to transmit mission data.' };
      }
      return { allowed: true };
    }

    default:
      return { allowed: false, reason: 'Unknown action type.' };
  }
}

/**
 * Applies a player action to update system state and resources.
 */
export function applyPlayerAction(state: MissionState, action: PlayerAction): MissionState {
  const check = canPerformAction(state, action);
  if (!check.allowed) return state;

  const nextActions = state.actionsLeft - 1;

  switch (action.type) {
    case 'REPAIR_SYSTEM': {
      return {
        ...state,
        actionsLeft: nextActions,
        systemModes: { ...state.systemModes, [action.systemId]: 'normal' },
        resources: { ...state.resources, energy: Math.max(0, state.resources.energy - 15) },
        eventLog: [`Day ${state.day}: Repaired ${action.systemId.toUpperCase()} back to normal (-15 Energy).`, ...state.eventLog],
      };
    }

    case 'CLEAN_SOLAR_PANELS': {
      return {
        ...state,
        actionsLeft: nextActions,
        systemModes: { ...state.systemModes, solar: 'normal' },
        resources: { ...state.resources, energy: Math.max(0, state.resources.energy - 5) },
        eventLog: [`Day ${state.day}: Cleaned Solar Panels (-5 Energy). Solar output restored.`, ...state.eventLog],
      };
    }

    case 'ROVER_COLLECT_SAMPLES': {
      return {
        ...state,
        actionsLeft: nextActions,
        resources: { ...state.resources, energy: Math.max(0, state.resources.energy - 20) },
        scienceScore: (state.scienceScore || 0) + 100,
        eventLog: [`Day ${state.day}: Rover collected core samples (-20 Energy, +100 Science).`, ...state.eventLog],
      };
    }

    case 'COMMS_TRANSMIT_REPORT': {
      return {
        ...state,
        actionsLeft: nextActions,
        resources: { ...state.resources, energy: Math.max(0, state.resources.energy - 15) },
        scienceScore: (state.scienceScore || 0) + 50,
        eventLog: [`Day ${state.day}: Transmitted telemetry data to Earth (-15 Energy, +50 Science).`, ...state.eventLog],
      };
    }

    default:
      return state;
  }
}