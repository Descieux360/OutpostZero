import type { MissionConfig, MissionState, ResourceName } from './types';
import { getEventForDay } from './events';
import { evaluateMission } from './evaluation';

export function createInitialMission(config: MissionConfig): MissionState {
  const startingResources = config.resources.reduce((acc, r) => {
    acc[r.id] = r.start;
    return acc;
  }, {} as MissionState['resources']);

  return {
    day: 1,
    resources: startingResources,
    crewCondition: 'stable',
    missionStatus: 'briefing',
    systemModes: {
      solar: 'normal',
      habitat: 'normal',
      greenhouse: 'normal',
    },
    eventLog: ['Day 1: Mission initialization complete. Base operating at standard parameters.'],
    history: [{ day: 1, resources: startingResources }],
  };
}

export function startMission(state: MissionState): MissionState {
  return {
    ...state,
    missionStatus: 'active',
  };
}

export function assessCrew(resources: MissionState['resources'], config: MissionConfig): MissionState['crewCondition'] {
  const { energy, oxygen, water, food } = resources;

  if (energy <= 0 || oxygen <= 0 || water <= 0 || food <= 0) {
    return 'critical';
  }

  for (const r of config.resources) {
    if (resources[r.id] < r.warnBelow) {
      return 'at-risk';
    }
  }

  return 'stable';
}

export function advanceDay(state: MissionState, config: MissionConfig): MissionState {
  if (state.missionStatus !== 'active' || state.pendingEventId) {
    return state;
  }

  // Check if a scheduled incident triggers today
  const pendingEvent = getEventForDay(state.day, state);
  if (
    pendingEvent &&
    state.pendingEventId !== pendingEvent.id &&
    !state.eventLog.some((l) => l.includes(`Event ${pendingEvent.id} resolved`))
  ) {
    return {
      ...state,
      pendingEventId: pendingEvent.id,
    };
  }

  // Base astronaut consumption per day
  const crewUsage: Record<ResourceName, number> = {
    energy: 0,
    oxygen: 7,
    water: 5,
    food: 7,
  };

  // Net deltas init
  const deltas: Record<ResourceName, number> = {
    energy: -crewUsage.energy,
    oxygen: -crewUsage.oxygen,
    water: -crewUsage.water,
    food: -crewUsage.food,
  };

  // Sum active system modes
  for (const sys of config.systems) {
    const activeMode = state.systemModes[sys.id] || 'normal';
    const modeEffects = sys.effectsByMode[activeMode] || {};

    (Object.keys(deltas) as ResourceName[]).forEach((res) => {
      if (modeEffects[res] !== undefined) {
        deltas[res] += modeEffects[res]!;
      }
    });
  }

  // Calculate new clamped resources
  const newResources = { ...state.resources };
  config.resources.forEach((r) => {
    const val = state.resources[r.id] + deltas[r.id];
    newResources[r.id] = Math.min(r.max, Math.max(0, val));
  });

  const newCrewCondition = assessCrew(newResources, config);
  const nextDay = state.day + 1;

  const formatDelta = (num: number) => (num >= 0 ? `+${num}` : `${num}`);
  const summaryLog = `Day ${state.day} Summary: ΔE:${formatDelta(deltas.energy)}, ΔO2:${formatDelta(deltas.oxygen)}, ΔH2O:${formatDelta(deltas.water)}, ΔFood:${formatDelta(deltas.food)}`;

  let nextState: MissionState = {
    ...state,
    day: nextDay,
    resources: newResources,
    crewCondition: newCrewCondition,
    history: [...state.history, { day: nextDay, resources: newResources }],
    eventLog: [summaryLog, ...state.eventLog],
  };

  const evaluatedStatus = evaluateMission(nextState, config);
  nextState.missionStatus = evaluatedStatus;

  return nextState;
}