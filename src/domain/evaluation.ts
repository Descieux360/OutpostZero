import type { MissionState, MissionConfig, MissionStatus } from './types';

export interface MissionDebriefSummary {
  status: MissionStatus;
  daysCompleted: number;
  totalDays: number;
  finalResources: MissionState['resources'];
  survivalScore: number;
  scienceScore: number;
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
  const maxPossible = 200 * 4;
  const survivalScore = Math.min(
    100,
    Math.round((daysCompleted / config.totalDays) * 70 + (totalResourceBalance / maxPossible) * 30)
  );

  return {
    status,
    daysCompleted,
    totalDays: config.totalDays,
    finalResources: state.resources,
    survivalScore,
    scienceScore: state.scienceScore || 0,
    keyTakeaways: [
      'Power Is Everything: Without electricity from solar panels, air scrubbers and water recyclers stop running.',
      'Water Recycling Saves Lives: Closed-loop recycling recovers water from humidity to keep crops and astronauts alive.',
      'Real NASA Satellite Data: Real-time NASA DONKI satellite alerts let lunar crews shelter before Solar Particle Events hit.',
    ],
    sourcesUsed: [
      'NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information) - Solar Energetic Particle (SEP) Records',
      'Canadian Space Agency (CSA): Deep Space Food Challenge & Life Support Systems Guidelines',
      'NASA Human Research Program: Lunar Habitat Shielding and Space Radiation Protection',
    ],
  };
}