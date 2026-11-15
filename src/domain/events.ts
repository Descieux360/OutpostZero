import type { MissionState } from './types';
import { getSepEvents } from '../data/donki';

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
  title: string;
  subtitle: string;
  description: string;
  nasaContext?: {
    eventTime: string;
    instruments: string[];
    linkedFlares: number;
    linkedCmes: number;
    disclaimer: string;
  };
  choices: IncidentChoice[];
}

/**
 * Generates dynamic incidents for a 30-day mission, mapping real NASA DONKI SEP satellite records.
 */
export function getEventForDay(day: number, state: MissionState): DynamicIncident | null {
  const donkiEvents = getSepEvents();
  const sepRecord = donkiEvents.length > 0 ? donkiEvents[day % donkiEvents.length] : null;

  if (day === 4) {
    return {
      id: 'power-fault-day-4',
      day: 4,
      title: '⚡ Power Grid Short Circuit',
      subtitle: 'Solar Array Transformer Overheat',
      description: 'Lunar regolith dust caused a transformer junction overload! Solar Array energy production drops.',
      choices: [
        {
          id: 'repair-now',
          label: 'Perform Immediate Repair',
          kidDescription: 'Use spare parts and power right away to fix the array.',
          tradeoffExplanation: 'Costs 10 Energy immediately, but returns Solar Array to Normal mode.',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, solar: 'normal' },
            resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 10) },
            eventLog: [`Day ${s.day}: Emergency repairs fixed the solar power grid!`, ...s.eventLog],
          }),
        },
        {
          id: 'conserve-power',
          label: 'Accept Damaged Output',
          kidDescription: 'Leave it damaged for now and conserve power.',
          tradeoffExplanation: 'Saves immediate energy, but Solar Array remains in Damaged mode (+15 Energy/day).',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, solar: 'damaged' },
            eventLog: [`Day ${s.day}: Power fault unaddressed. Solar array operating in damaged mode.`, ...s.eventLog],
          }),
        },
      ],
    };
  }

  if (day === 10 || day === 22) {
    const timeStr = sepRecord?.eventTime ? sepRecord.eventTime.slice(0, 10) : '2025-01-04';
    return {
      id: `solar-storm-day-${day}`,
      day,
      title: '🌞 NASA Alert: Solar Particle Event (SEP)',
      subtitle: 'High-Energy Proton Stream Approaching Lunar Surface',
      description: `NASA DONKI satellite alert! Real satellite observation from ${timeStr}. High radiation levels endanger moonbase operations.`,
      nasaContext: sepRecord
        ? {
            eventTime: sepRecord.eventTime,
            instruments: sepRecord.instruments,
            linkedFlares: sepRecord.linkedFlares,
            linkedCmes: sepRecord.linkedCmes,
            disclaimer: 'DONKI data provided by NASA CCMC (Earth-Moon orbit space weather monitoring). Prototyping research quality.',
          }
        : undefined,
      choices: [
        {
          id: 'bunker-shelter',
          label: 'Order Crew to Storm Shelter',
          kidDescription: 'Move crew into the underground shielded habitat module.',
          tradeoffExplanation: 'Keeps crew 100% safe! Pauses greenhouse operations today.',
          lessonId: 'radiation-shelter',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, greenhouse: 'paused' },
            crewCondition: s.crewCondition === 'critical' ? 'at-risk' : 'stable',
            eventLog: [`Day ${s.day}: Crew safely sheltered underground. Greenhouse paused for safety.`, ...s.eventLog],
          }),
        },
        {
          id: 'boost-deflection',
          label: 'Divert Power to Radiation Shields',
          kidDescription: 'Pump extra electrical energy into habitat electromagnetic shields.',
          tradeoffExplanation: 'Costs 25 Energy, but allows crew to stay active and greenhouse to run normally.',
          lessonId: 'radiation-shelter',
          effect: (s) => ({
            ...s,
            resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 25) },
            eventLog: [`Day ${s.day}: Diverted 25 Energy to radiation shields. Outpost kept working.`, ...s.eventLog],
          }),
        },
      ],
    };
  }

  if (day === 18) {
    return {
      id: 'water-recycler-leak-day-18',
      day: 18,
      title: '💧 Water Recycler Filter Clog',
      subtitle: 'Life Support Fluid Loop Warning',
      description: 'Lunar regolith dust clogged the primary water reclamation unit.',
      choices: [
        {
          id: 'clean-filter',
          label: 'Flush & Clean Filters',
          kidDescription: 'Use pure water to flush out dust particles.',
          tradeoffExplanation: 'Uses 15 Water now to clean system and avoid long-term shortages.',
          lessonId: 'life-support',
          effect: (s) => ({
            ...s,
            resources: { ...s.resources, water: Math.max(0, s.resources.water - 15) },
            systemModes: { ...s.systemModes, habitat: 'normal' },
            eventLog: [`Day ${s.day}: Flushed water recycler with 15 Water. ECLSS fully operational.`, ...s.eventLog],
          }),
        },
        {
          id: 'pause-greenhouse-water',
          label: 'Throttle Greenhouse Irrigation',
          kidDescription: 'Save water by cutting back on greenhouse plant watering today.',
          tradeoffExplanation: 'Preserves current water tank levels, but sets Greenhouse to Conserve mode.',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, greenhouse: 'conserve' },
            eventLog: [`Day ${s.day}: Throttled greenhouse irrigation to protect life-support water supply.`, ...s.eventLog],
          }),
        },
      ],
    };
  }

  return null;
}

export function resolveEvent(state: MissionState, choiceId: string): MissionState {
  if (!state.pendingEventId) return state;

  const incident = getEventForDay(state.day, state);
  if (!incident) return { ...state, pendingEventId: undefined };

  const chosenOption = incident.choices.find((c) => c.id === choiceId);
  if (!chosenOption) return state;

  const updatedState = chosenOption.effect(state);
  return {
    ...updatedState,
    pendingEventId: undefined,
    eventLog: [`Event ${incident.id} resolved`, ...updatedState.eventLog],
  };
}