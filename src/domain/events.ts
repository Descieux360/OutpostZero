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
      title: 'Panne du réseau électrique',
      subtitle: 'Surchauffe des panneaux solaires',
      description: 'La poussière lunaire a provoqué un défaut de connexion. La production des panneaux baisse jusqu’à la réparation.',
      affectedSystemId: 'solar',
      choices: [
        {
          id: 'repair-now',
          label: 'Réparer immédiatement',
          kidDescription: 'Utilise des pièces de rechange et de l’énergie pour réparer les panneaux.',
          tradeoffExplanation: 'Coûte 10 unités d’énergie et rétablit la production solaire.',
          effect: (s) => ({
            ...s,
            systemModes: { ...s.systemModes, solar: 'normal' },
            resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 10) },
            eventLog: [`Day ${s.day}: Quick repairs fixed the solar power grid!`, ...s.eventLog],
          }),
        },
        {
          id: 'delay-repair',
          label: 'Reporter la réparation',
          kidDescription: 'Économise de l’énergie maintenant, mais laisse les panneaux endommagés.',
          tradeoffExplanation: 'La production solaire reste réduite jusqu’à la réparation.',
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
      title: 'Alerte solaire : particules énergétiques',
      subtitle: 'Risque accru de radiations',
      description: `Le scénario s’inspire d’une donnée NASA DONKI du ${timeStr}. L’équipage doit réagir à une alerte de radiation.`,
      affectedSystemId: 'habitat',
      nasaContext: sepRecord
        ? {
            eventTime: sepRecord.eventTime,
            instruments: sepRecord.instruments,
            linkedFlares: sepRecord.linkedFlares,
            linkedCmes: sepRecord.linkedCmes,
            disclaimer: 'Donnée NASA DONKI destinée au contexte éducatif ; elle ne constitue pas une alerte opérationnelle.',
          }
        : undefined,
      choices: [
        {
          id: 'bunker-shelter',
          label: 'Mettre l’équipage à l’abri',
          kidDescription: 'Déplace l’équipage dans la zone protégée de la base.',
          tradeoffExplanation: 'Dans le jeu, l’équipage est protégé, mais les activités extérieures s’arrêtent.',
          lessonId: 'radiation-shelter',
          effect: (s) => ({
            ...s,
            radiation: 'protected',
            eventLog: [`Day ${s.day}: Crew safely sheltered underground during Solar Particle Event.`, ...s.eventLog],
          }),
        },
        {
          id: 'boost-deflection',
          label: 'Alimenter les protections',
          kidDescription: 'Réserve de l’énergie pour les protections de l’habitat.',
          tradeoffExplanation: 'Coûte 25 unités d’énergie dans cette simulation.',
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