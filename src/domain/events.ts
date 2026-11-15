import type { MissionState } from './types';
import { getSepEvents } from '../data/donki';
import { RANDOM_SCENARIO_POOL, type DynamicIncident } from '../data/eventsData';
import { nextRandom } from './random';

export function getEventForDay(day: number, state: MissionState): DynamicIncident | null {
  if (day === 1) return null;

  // RULE: At most one event per day!
  if (state.decisions.some((d) => d.day === day)) {
    return null;
  }

  const donkiEvents = getSepEvents();
  const sepRecord = donkiEvents.length > 0 ? donkiEvents[day % donkiEvents.length] : null;

  // 1. Scripted Anchors (Days 4, 12, 22)
  if (day === 4) {
    return {
      id: 'power-fault-day-4',
      day: 4,
      isScripted: true,
      title: 'Power Grid Problem',
      subtitle: 'Solar panel overheating',
      description: 'Moon dust caused a connection problem. The panels will make less power until they are repaired.',
      affectedSystemId: 'solar',
      choices: [
        {
          id: 'repair-now',
          label: 'Repair the panels now',
          kidDescription: 'Use spare parts and energy to fix the panels.',
          tradeoffExplanation: 'Costs 10 Energy and restores the panels to full power.',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, solar: 'normal' },
            resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 10) },
            eventLog: [`Day ${s.day}: Quick repairs fixed the solar power grid!`, ...s.eventLog],
          }),
        },
        {
          id: 'delay-repair',
          label: 'Wait to repair',
          kidDescription: 'Save energy now, but leave the panels damaged.',
          tradeoffExplanation: 'The panels will keep making less power until they are repaired.',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, solar: 'damaged' },
            eventLog: [`Day ${s.day}: Power fault left unaddressed. Solar output reduced.`, ...s.eventLog],
          }),
        },
      ],
    };
  }

  if (day === 12 || day === 22) {
    const timeStr = sepRecord?.eventTime ? sepRecord.eventTime.slice(0, 10) : '2025-01-04';
    return {
      id: `solar-storm-day-${day}`,
      day,
      isScripted: true,
      title: 'Solar Alert: Energetic Particles',
      subtitle: 'Higher radiation risk',
      description: `This simulation is inspired by a NASA DONKI record from ${timeStr}. The crew must respond to a radiation alert.`,
      affectedSystemId: 'habitat',
      nasaContext: sepRecord
        ? {
            eventTime: sepRecord.eventTime,
            instruments: sepRecord.instruments,
            linkedFlares: sepRecord.linkedFlares,
            linkedCmes: sepRecord.linkedCmes,
            disclaimer: 'NASA DONKI data is provided for learning and context. It is not an operational alert.',
          }
        : undefined,
      choices: [
        {
          id: 'bunker-shelter',
          label: 'Move the crew to shelter',
          kidDescription: 'Move the crew to the protected area inside the base.',
          tradeoffExplanation: 'The crew is protected in the game, but outdoor work stops.',
          lessonId: 'radiation-shelter',
          effect: (s) => ({
            ...s,
            radiation: 'protected',
            eventLog: [`Day ${s.day}: Crew safely sheltered underground during Solar Particle Event.`, ...s.eventLog],
          }),
        },
        {
          id: 'boost-deflection',
          label: 'Power the shields',
          kidDescription: 'Save energy to power the habitat shields.',
          tradeoffExplanation: 'Costs 25 Energy in this simulation.',
          lessonId: 'radiation-shelter',
          effect: (s) => ({
            ...s,
            radiation: 'protected',
            resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 25) },
            eventLog: [`Day ${s.day}: Diverted 25 Energy to radiation shields. Outpost safe.`, ...s.eventLog],
          }),
        },
      ],
    };
  }

  // 2. Random Events (35% chance, max 2 consecutive event days)
  const hasEventOnDayMinus1 = state.decisions.some((d) => d.day === day - 1);
  const hasEventOnDayMinus2 = state.decisions.some((d) => d.day === day - 2);
  if (hasEventOnDayMinus1 && hasEventOnDayMinus2) {
    return null;
  }

  const [roll] = nextRandom(state.rngState);
  if (roll > 0.35) {
    return null;
  }

  const usedIds = state.decisions.map((d) => d.eventId);
  const availablePool = RANDOM_SCENARIO_POOL.filter((item) => !usedIds.includes(item.id));
  if (availablePool.length === 0) return null;

  const poolIdx = Math.floor(roll * availablePool.length);
  const selected = availablePool[poolIdx];

  return {
    ...selected,
    day,
    isScripted: false,
  };
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
    decisions: [
      ...updatedState.decisions,
      {
        day: state.day,
        eventId: incident.id,
        choiceId: chosenOption.id,
        summary: chosenOption.label,
      },
    ],
  };
}