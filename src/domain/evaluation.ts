import type { MissionState, MissionConfig, MissionStatus } from './types';

export interface MissionDebriefSummary {
  status: MissionStatus;
  daysCompleted: number;
  totalDays: number;
  finalResources: MissionState['resources'];
  survivalScore: number;
  keyTakeaways: string[];
  sourcesUsed: string[];
}

export function evaluateMission(state: MissionState, config: MissionConfig): MissionStatus {
  if (state.crewCondition === 'critical') {
    return 'failed';
  }
  if (state.day >= config.totalDays && state.missionStatus === 'active') {
    return 'completed';
  }
  return state.missionStatus;
}

export function generateDebrief(state: MissionState, config: MissionConfig): MissionDebriefSummary {
  const status = evaluateMission(state, config);
  const daysCompleted = Math.min(state.day, config.totalDays);

  const totalResourceBalance =
    state.resources.energy + state.resources.oxygen + state.resources.water + state.resources.food;

  const maxEnergy = config.resources.find((r) => r.id === 'energy')?.max || 200;
  const maxPossible = maxEnergy * 4;
  const survivalScore = Math.min(
    100,
    Math.round((daysCompleted / config.totalDays) * 70 + (totalResourceBalance / maxPossible) * 30)
  );

  const keyTakeaways: string[] = [
    'Energy production is foundational: Without power from Solar Arrays, Life Support and Greenhouses shut down.',
    'Closed-Loop Recycling: Water and Oxygen must be continually reclaimed from cabin air and moisture.',
    'Space Weather Awareness: Real NASA DONKI satellite monitoring allows astronaut teams to prepare for high-radiation Solar Particle Events.',
  ];

  const sourcesUsed: string[] = [
    'NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information) - Solar Energetic Particle (SEP) Events (Jan 2025 Snapshot)',
    'Canadian Space Agency (CSA): Deep Space Food Challenge & Life Support Systems Constraints',
    'NASA Human Research Program: Radiation Shielding Guidelines for Lunar Surface Exploration',
  ];

  return {
    status,
    daysCompleted,
    totalDays: config.totalDays,
    finalResources: state.resources,
    survivalScore,
    keyTakeaways,
    sourcesUsed,
  };
}