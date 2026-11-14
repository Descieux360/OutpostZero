import type { MissionConfig } from '../domain/types'

/**
 * MOCK SCENARIO. Every number below is a GAME ASSUMPTION in game units.
 * None is a NASA value or a real engineering rate (spec 5.1, 7.3).
 * All balance constants live here and nowhere else (spec 9.5).
 */
export const lunarScenario: MissionConfig = {
  name: 'Lunar Mission 01',
  totalDays: 7,
  resources: [
    { id: 'energy', label: 'Energy', start: 100, max: 150, warnBelow: 30 },
    { id: 'oxygen', label: 'Oxygen', start: 100, max: 150, warnBelow: 30 },
    { id: 'water', label: 'Water', start: 100, max: 150, warnBelow: 30 },
    { id: 'food', label: 'Food', start: 80, max: 150, warnBelow: 25 },
  ],
  systems: [
    {
      id: 'solar',
      lessonId: 'energy-planning',
      name: 'Solar array',
      role: 'Energy supply',
      effectsByMode: { normal: { energy: 40 }, conserve: { energy: 40 }, damaged: { energy: 15 } },
      explainer:
        'The array is the outpost’s only power source. Everything else depends on it, so a fault here spreads to the other systems.',
    },
    {
      id: 'habitat',
      lessonId: 'radiation-shelter',
      name: 'Habitat and life support',
      role: 'Oxygen, water recovery, crew shelter',
      effectsByMode: {
        normal: { energy: -18, oxygen: 6, water: 4 },
        conserve: { energy: -12, oxygen: 4, water: 3 },
      },
      explainer:
        'Houses the crew and keeps oxygen and water in balance. It also holds the shielded area used during the radiation event.',
    },
    {
      id: 'greenhouse',
      lessonId: 'food-needs-inputs',
      name: 'Greenhouse',
      role: 'Food production',
      effectsByMode: {
        normal: { energy: -14, water: -9, food: 12 },
        conserve: { energy: -8, water: -5, food: 6 },
      },
      explainer:
        'Grows food, but needs both water and energy to do it. Pausing it protects other reserves and costs food.',
    },
  ],
  // Display-only for now. Incident resolution is the next build step.
  incidents: [
    { id: 'solar-storm', day: 3, title: 'Solar storm', summary: 'Decide whether to shelter the crew in the shielded habitat area.' },
    { id: 'power-fault', day: 5, title: 'Power-system fault', summary: 'A fault reduces solar array output.' },
    { id: 'water-shortage', day: 6, title: 'Water shortage', summary: 'Reserves run low. Protect water or protect food.' },
  ],
}

/** Per-day crew consumption in game units. Game assumption. */
export const crewUse = { oxygen: -8, water: -6, food: -9 } as const
