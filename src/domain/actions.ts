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
    return { allowed: false, reason: 'La mission n’est pas en cours.' };
  }
  if (state.pendingEventId) {
    return { allowed: false, reason: 'Résous d’abord l’incident en cours.' };
  }
  if (state.actionsLeft <= 0) {
    return { allowed: false, reason: 'Aucune action restante aujourd’hui. Avance au jour suivant.' };
  }

  switch (action.type) {
    case 'REPAIR_SYSTEM': {
      const currentMode = state.systemModes[action.systemId];
      if (currentMode !== 'damaged') {
        return { allowed: false, reason: 'Ce système fonctionne normalement et n’a pas besoin d’être réparé.' };
      }
      if (state.resources.energy < 15) {
        return { allowed: false, reason: 'Il faut 15 unités d’énergie pour effectuer la réparation.' };
      }
      return { allowed: true };
    }

    case 'CLEAN_SOLAR_PANELS': {
      if (state.resources.energy < 5) {
        return { allowed: false, reason: 'Il faut 5 unités d’énergie pour nettoyer les panneaux.' };
      }
      return { allowed: true };
    }

    case 'ROVER_COLLECT_SAMPLES': {
      if (state.resources.energy < 20) {
        return { allowed: false, reason: 'Il faut 20 unités d’énergie pour envoyer le rover.' };
      }
      return { allowed: true };
    }

    case 'COMMS_TRANSMIT_REPORT': {
      if (state.resources.energy < 15) {
        return { allowed: false, reason: 'Il faut 15 unités d’énergie pour transmettre les données.' };
      }
      return { allowed: true };
    }

    default:
      return { allowed: false, reason: 'Action inconnue.' };
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