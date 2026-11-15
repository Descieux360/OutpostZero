import type { MissionConfig } from '../domain/types';

export const LUNAR_SCENARIO: MissionConfig = {
  name: 'Outpost Zero: 30-Day Lunar Surface Mission',
  totalDays: 30,
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
        normal: { energy: 42 },
        conserve: { energy: 28 },
        paused: { energy: 0 },
        damaged: { energy: 15 },
      },
      explainer: 'Photovoltaic panels collect sunlight during the lunar day to charge fuel cells.',
    },
    {
      id: 'habitat',
      name: 'Habitat & Life Support',
      role: 'Recycles air and water for astronaut survival',
      effectsByMode: {
        normal: { energy: -16, oxygen: 8, water: 5 },
        conserve: { energy: -10, oxygen: 5, water: 3 },
        paused: { energy: 0, oxygen: 0, water: 0 },
        damaged: { energy: -20, oxygen: 3, water: 1 },
      },
      explainer: 'Environmental Control and Life Support System (ECLSS) reclaims humidity and scrubs CO2.',
      lessonId: 'life-support',
    },
    {
      id: 'greenhouse',
      name: 'Hydroponic Greenhouse',
      role: 'Grows fresh crops and yields biomass',
      effectsByMode: {
        normal: { energy: -14, water: -8, food: 11, oxygen: 2 },
        conserve: { energy: -8, water: -4, food: 6, oxygen: 1 },
        paused: { energy: 0, water: 0, food: 0, oxygen: 0 },
        damaged: { energy: -15, water: -10, food: 2, oxygen: 0 },
      },
      explainer: 'LED hydroponics supply fresh nutrition, requiring significant water and electricity.',
    },
  ],
  incidents: [
    { id: 'power-fault-day-4', day: 4, title: 'Power Grid Short Circuit', summary: 'Solar Array junction malfunction.' },
    { id: 'solar-storm-day-10', day: 10, title: 'Solar Energetic Particle Event', summary: 'High radiation proton flux.' },
    { id: 'water-recycler-leak-day-18', day: 18, title: 'Water Recycler Filter Clog', summary: 'Regolith dust in ECLSS filters.' },
    { id: 'solar-storm-day-22', day: 22, title: 'Solar Energetic Particle Event', summary: 'Second solar particle surge.' },
  ],
};
