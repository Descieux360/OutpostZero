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
    title: '🧹 Moon Dust on Solar Panels',
    subtitle: 'Reduced solar power',
    description: 'Moon dust has settled on the solar panels, so they may make less electricity.',
    affectedSystemId: 'solar',
    choices: [
      {
        id: 'clean-dust',
        label: 'Clean the panels',
        kidDescription: 'Use one action and a little energy to brush away the dust.',
        tradeoffExplanation: 'Costs 5 Energy and restores the panels to full power.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 5) },
          eventLog: [`Day ${s.day}: Cleaned lunar dust off solar collectors.`, ...s.eventLog],
        }),
      },
      {
        id: 'ignore-dust',
        label: 'Leave the dust for now',
        kidDescription: 'Save energy, but the panels will stay dusty.',
        tradeoffExplanation: 'Solar panels make less power today.',
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
    title: '🪨 A Mysterious Moon Crystal',
    subtitle: 'Rover discovery',
    description: 'The rover spotted an interesting crystal near a shadowy crater.',
    choices: [
      {
        id: 'analyze-rock',
        label: 'Study the sample',
        kidDescription: 'Use energy to learn more about the crystal.',
        tradeoffExplanation: 'Costs 15 Energy and earns 50 Science points.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 15) },
          scienceScore: (s.scienceScore || 0) + 50,
          eventLog: [`Day ${s.day}: Analyzed rare lunar crystal! +50 Science Score.`, ...s.eventLog],
        }),
      },
      {
        id: 'skip-rock',
        label: 'Keep moving',
        kidDescription: 'Save electricity for the most important systems.',
        tradeoffExplanation: 'Costs nothing, but earns no Science points.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Rover passed by rock sample to conserve power.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'water-recycler-bubble',
    title: '🧼 A Bubble in the Recycling Loop',
    subtitle: 'A small life-support problem',
    description: 'An air bubble is slowing down the water filter in this simulation.',
    affectedSystemId: 'habitat',
    choices: [
      {
        id: 'flush-pipe',
        label: 'Flush the pipe',
        kidDescription: 'Use a little clean water to push the bubble out.',
        tradeoffExplanation: 'Uses 10 Water and gets the system flowing again.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, water: Math.max(0, s.resources.water - 10) },
          eventLog: [`Day ${s.day}: Flushed air bubble out of water recycler.`, ...s.eventLog],
        }),
      },
      {
        id: 'low-flow',
        label: 'Use a slower flow',
        kidDescription: 'Run the filter more slowly today.',
        tradeoffExplanation: 'Life support switches to conserve mode for today.',
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
    title: '🌱 Check the Greenhouse Nutrients',
    subtitle: 'Hydroponic growing balance',
    description: 'The greenhouse plants need the right mix of nutrients to grow well.',
    affectedSystemId: 'greenhouse',
    choices: [
      {
        id: 'boost-minerals',
        label: 'Add plant nutrients',
        kidDescription: 'Give the plants extra water and minerals.',
        tradeoffExplanation: 'Costs 12 Water, but grows 15 extra Food.',
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
        label: 'Keep the usual schedule',
        kidDescription: 'Keep watering the plants as usual.',
        tradeoffExplanation: 'No extra cost, and the plants keep growing as normal.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Maintained standard hydroponic feeding.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'crew-morale-movie',
    title: '🍿 Crew Movie Night',
    subtitle: 'Crew well-being and rest',
    description: 'After a busy day, the crew would like to relax and spend time together.',
    choices: [
      {
        id: 'host-movie',
        label: 'Use the shared screen',
        kidDescription: 'Use a little electricity for some crew fun.',
        tradeoffExplanation: 'Costs 10 Energy and helps the crew feel better.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 10) },
          crewCondition: s.crewCondition === 'at-risk' ? 'stable' : s.crewCondition,
          eventLog: [`Day ${s.day}: Hosted crew movie night! Crew morale boosted.`, ...s.eventLog],
        }),
      },
      {
        id: 'early-bedtime',
        label: 'Turn in early',
        kidDescription: 'Save energy and let the crew get some rest.',
        tradeoffExplanation: 'Saves energy, but does not change crew morale.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Crew turned lights out early to save power.`, ...s.eventLog],
        }),
      },
    ],
  },
];