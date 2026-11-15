import type { MissionConfig } from '../domain/types';

export const LUNAR_SCENARIO: MissionConfig = {
  name: 'Outpost Zero: 30-Day Lunar Surface Mission',
  totalDays: 30,
  dailyActionsAllowed: 2,
  enableExtraActions: true,
  resources: [
    { id: 'energy', label: 'Energy (kWh)', start: 120, max: 200, warnBelow: 30 },
    { id: 'oxygen', label: 'Oxygen (L)', start: 120, max: 200, warnBelow: 30 },
    { id: 'water', label: 'Water (L)', start: 120, max: 200, warnBelow: 30 },
    { id: 'food', label: 'Food Rations', start: 100, max: 200, warnBelow: 25 },
  ],
  systems: [
    {
      id: 'solar',
      name: 'Solar Array Field',
      role: 'Generates electrical power for base modules',
      effectsByMode: {
        normal: { energy: 45 },
        conserve: { energy: 30 },
        paused: { energy: 0 },
        damaged: { energy: 18 },
      },
      explainer: 'Photovoltaic solar panels turn sunlight into electricity stored in moonbase batteries.',
      lessonId: 'power-budgeting',
    },
    {
      id: 'habitat',
      name: 'Habitat & Life Support',
      role: 'Recycles air and water for astronaut survival',
      effectsByMode: {
        normal: { energy: -18, oxygen: 8, water: 6 },
        conserve: { energy: -10, oxygen: 5, water: 3 },
        paused: { energy: 0, oxygen: 0, water: 0 },
        damaged: { energy: -20, oxygen: 3, water: 1 },
      },
      explainer: 'The ECLSS system reclaims water from cabin moisture and scrubs carbon dioxide.',
      lessonId: 'life-support',
    },
    {
      id: 'greenhouse',
      name: 'Hydroponic Greenhouse',
      role: 'Grows fresh crops and yields biomass',
      effectsByMode: {
        normal: { energy: -16, water: -7, food: 10, oxygen: 2 },
        conserve: { energy: -8, water: -3, food: 5, oxygen: 1 },
        paused: { energy: 0, water: 0, food: 0, oxygen: 0 },
        damaged: { energy: -15, water: -10, food: 2, oxygen: 0 },
      },
      explainer: 'Hydroponic crop bays grow fresh produce using water, LED lamps, and nutrients.',
      lessonId: 'food-production',
    },
  ],
  incidents: [
    { id: 'power-fault-day-4', day: 4, title: 'Power Grid Short Circuit', summary: 'Solar Array junction malfunction.' },
    { id: 'solar-storm-day-12', day: 12, title: 'Solar Energetic Particle Event', summary: 'High radiation proton flux.' },
    { id: 'solar-storm-day-22', day: 22, title: 'Solar Energetic Particle Event', summary: 'Second solar particle surge.' },
  ],
};