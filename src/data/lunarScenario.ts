import type { MissionConfig } from '../domain/types';

export const LUNAR_SCENARIO: MissionConfig = {
  name: 'Lunar Outpost Zero 30-Day Mission',
  totalDays: 30,
  dailyActionsAllowed: 2,
  enableExtraActions: true,
  resources: [
    { id: 'energy', label: 'Energy (kWh)', start: 120, max: 200, warnBelow: 30 },
    { id: 'oxygen', label: 'Oxygen (L)', start: 150, max: 200, warnBelow: 30 },
    { id: 'water', label: 'Water (L)', start: 200, max: 200, warnBelow: 30 },
    { id: 'food', label: 'Food Rations', start: 100, max: 200, warnBelow: 25 },
  ],
  systems: [
    {
      id: 'solar',
      name: 'Solar Power Plant',
      role: 'Makes electricity to power the moonbase.',
      effectsByMode: {
        normal: { energy: 45 },
        conserve: { energy: 30 },
        paused: { energy: 0 },
        damaged: { energy: 18 },
      },
      explainer: 'Generates electricity from sunlight to power all moonbase modules.',
      lessonId: 'power-budgeting',
    },
    {
      id: 'habitat',
      name: 'Habitat Pod',
      role: 'Recycles air and cleans water to help the crew stay healthy.',
      effectsByMode: {
        normal: { energy: -18, oxygen: 8, water: 6 },
        conserve: { energy: -10, oxygen: 5, water: 3 },
        paused: { energy: 0, oxygen: 0, water: 0 },
        damaged: { energy: -20, oxygen: 3, water: 1 },
      },
      explainer: 'Recycles breathing air (CO2 scrubbing) and purifies water for crew survival.',
      lessonId: 'life-support',
    },
    {
      id: 'greenhouse',
      name: 'Hydroponic Greenhouse',
      role: 'Grows plants that provide food for the crew.',
      effectsByMode: {
        normal: { energy: -16, water: -7, food: 10, oxygen: 2 },
        conserve: { energy: -8, water: -3, food: 5, oxygen: 1 },
        paused: { energy: 0, water: 0, food: 0, oxygen: 0 },
        damaged: { energy: -15, water: -10, food: 2, oxygen: 0 },
      },
      explainer: 'Grows fresh food rations using hydroponics to feed the astronauts.',
      lessonId: 'food-production',
    },
  ],
  incidents: [
    { id: 'power-fault-day-4', day: 4, title: 'Power Grid Problem', summary: 'A solar panel connection stopped working.' },
    { id: 'solar-storm-day-12', day: 12, title: 'Solar Particle Alert', summary: 'More radiation from the Sun is heading toward the Moon.' },
    { id: 'solar-storm-day-22', day: 22, title: 'Solar Particle Alert', summary: 'A second burst of solar particles is heading our way.' },
  ],
};