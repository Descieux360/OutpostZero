import type { MissionState } from '../domain/types';

export interface IncidentChoice {
  id: string;
  label: string;
  kidDescription: string;
  tradeoffExplanation: string;
  lessonId?: string;
  effect: (state: MissionState) => MissionState;
}

export interface DynamicIncident {
  id: string;
  day: number;
  isScripted: boolean;
  title: string;
  subtitle: string;
  description: string;
  affectedSystemId?: 'solar' | 'habitat' | 'greenhouse';
  nasaContext?: {
    eventTime: string;
    instruments: string[];
    linkedFlares: number;
    linkedCmes: number;
    disclaimer: string;
  };
  choices: IncidentChoice[];
}

export const RANDOM_SCENARIO_POOL: Array<Omit<DynamicIncident, 'day' | 'isScripted'>> = [
  {
    id: 'dust-on-panels',
    title: '🧹 Regolith Dust Coating',
    subtitle: 'Solar Collector Efficiency Drop',
    description: 'Fine lunar dust has settled on the solar panels after a nearby meteoroid kick-up.',
    affectedSystemId: 'solar',
    choices: [
      {
        id: 'clean-dust',
        label: 'Wipe Panels Clean',
        kidDescription: 'Use an action and a little power to vibrate dust off the glass.',
        tradeoffExplanation: 'Costs 5 Energy now to keep solar output at 100%.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 5) },
          eventLog: [`Day ${s.day}: Cleaned lunar dust off solar collectors.`, ...s.eventLog],
        }),
      },
      {
        id: 'ignore-dust',
        label: 'Leave Dust for Today',
        kidDescription: 'Save your energy and let the panels stay dusty.',
        tradeoffExplanation: 'Sets Solar Array to Conserve mode for today.',
        effect: (s) => ({
          ...s,
          systemModes: { ...s.systemModes, solar: 'conserve' },
          eventLog: [`Day ${s.day}: Left dust on solar panels. Energy production reduced today.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'rover-rock-discovery',
    title: '🪨 Curious Lunar Crystal',
    subtitle: 'Autonomous Rover Discovery',
    description: 'The moon rover spotted a rare titanium-rich crystal in a shadow crater!',
    choices: [
      {
        id: 'analyze-rock',
        label: 'Run Deep Laser Scan',
        kidDescription: 'Use power to scan the rock sample for space science.',
        tradeoffExplanation: 'Costs 15 Energy, increases Science Score by +50 points!',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 15) },
          scienceScore: (s.scienceScore || 0) + 50,
          eventLog: [`Day ${s.day}: Analyzed rare lunar crystal! +50 Science Score.`, ...s.eventLog],
        }),
      },
      {
        id: 'skip-rock',
        label: 'Drive Past Sample',
        kidDescription: 'Save electricity for life support.',
        tradeoffExplanation: 'No energy cost, but no science bonus earned.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Rover passed by rock sample to conserve power.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'water-recycler-bubble',
    title: '🧼 Recycler Air Bubble',
    subtitle: 'Life Support Plumbing Hiccup',
    description: 'A tiny microgravity air bubble got trapped in the water filtration pipe.',
    affectedSystemId: 'habitat',
    choices: [
      {
        id: 'flush-pipe',
        label: 'Flush Fluid Loop',
        kidDescription: 'Use a small amount of clean water to push the bubble out.',
        tradeoffExplanation: 'Uses 10 Water immediately to restore full flow.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, water: Math.max(0, s.resources.water - 10) },
          eventLog: [`Day ${s.day}: Flushed air bubble out of water recycler.`, ...s.eventLog],
        }),
      },
      {
        id: 'low-flow',
        label: 'Run Low-Flow Recycling',
        kidDescription: 'Let the filter run slower for today.',
        tradeoffExplanation: 'Sets Habitat to Conserve mode today.',
        effect: (s) => ({
          ...s,
          systemModes: { ...s.systemModes, habitat: 'conserve' },
          eventLog: [`Day ${s.day}: Ran water recycler in low-flow conserve mode.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'greenhouse-nutrient-drift',
    title: '🌱 Plant Nutrient Dip',
    subtitle: 'Hydroponic Tank Balance',
    description: 'The lunar crop veggies need a fresh mineral mix to keep growing fast.',
    affectedSystemId: 'greenhouse',
    choices: [
      {
        id: 'boost-minerals',
        label: 'Add Extra Mineral Solution',
        kidDescription: 'Feed the plants extra water and minerals today.',
        tradeoffExplanation: 'Costs 12 Water, but yields +15 bonus Food today!',
        effect: (s) => ({
          ...s,
          resources: {
            ...s.resources,
            water: Math.max(0, s.resources.water - 12),
            food: Math.min(200, s.resources.food + 15),
          },
          eventLog: [`Day ${s.day}: Added mineral solution to crops (+15 Food).`, ...s.eventLog],
        }),
      },
      {
        id: 'standard-mix',
        label: 'Keep Standard Feed',
        kidDescription: 'Maintain normal watering schedules.',
        tradeoffExplanation: 'No extra cost, standard crop growth.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Maintained standard hydroponic feeding.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'crew-morale-movie',
    title: '🍿 Junior Astronaut Movie Night',
    subtitle: 'Crew Wellbeing & Rest',
    description: 'The crew wants to watch a space movie together to relax after hard work.',
    choices: [
      {
        id: 'host-movie',
        label: 'Power On Main Screen',
        kidDescription: 'Use a bit of electricity for astronaut recreation.',
        tradeoffExplanation: 'Costs 10 Energy, keeps Crew Condition stable.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 10) },
          crewCondition: s.crewCondition === 'at-risk' ? 'stable' : s.crewCondition,
          eventLog: [`Day ${s.day}: Hosted crew movie night! Crew morale boosted.`, ...s.eventLog],
        }),
      },
      {
        id: 'early-bedtime',
        label: 'Early Rest & Lights Out',
        kidDescription: 'Save power and send crew to sleep early.',
        tradeoffExplanation: 'Saves power, no morale change.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Crew turned lights out early to save power.`, ...s.eventLog],
        }),
      },
    ],
  },
];