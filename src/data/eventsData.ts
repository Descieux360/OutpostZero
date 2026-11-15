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
    title: '🧹 Poussière lunaire sur les panneaux',
    subtitle: 'Production solaire réduite',
    description: 'De la poussière lunaire s’est déposée sur les panneaux. Leur production peut diminuer.',
    affectedSystemId: 'solar',
    choices: [
      {
        id: 'clean-dust',
        label: 'Nettoyer les panneaux',
        kidDescription: 'Utilise une action et un peu d’énergie pour enlever la poussière.',
        tradeoffExplanation: 'Coûte 5 unités d’énergie et rétablit la production des panneaux.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 5) },
          eventLog: [`Day ${s.day}: Cleaned lunar dust off solar collectors.`, ...s.eventLog],
        }),
      },
      {
        id: 'ignore-dust',
        label: 'Laisser la poussière pour aujourd’hui',
        kidDescription: 'Économise l’énergie, mais les panneaux restent poussiéreux.',
        tradeoffExplanation: 'Réduit la production solaire pour aujourd’hui.',
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
    title: '🪨 Cristal lunaire mystérieux',
    subtitle: 'Découverte du rover',
    description: 'Le rover a repéré un cristal intéressant près d’un cratère ombragé.',
    choices: [
      {
        id: 'analyze-rock',
        label: 'Analyser l’échantillon',
        kidDescription: 'Utilise de l’énergie pour analyser l’échantillon.',
        tradeoffExplanation: 'Coûte 15 unités d’énergie et rapporte 50 points de science.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 15) },
          scienceScore: (s.scienceScore || 0) + 50,
          eventLog: [`Day ${s.day}: Analyzed rare lunar crystal! +50 Science Score.`, ...s.eventLog],
        }),
      },
      {
        id: 'skip-rock',
        label: 'Continuer la route',
        kidDescription: 'Économise l’électricité pour les systèmes essentiels.',
        tradeoffExplanation: 'Aucun coût, mais aucun bonus scientifique.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Rover passed by rock sample to conserve power.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'water-recycler-bubble',
    title: '🧼 Bulle dans le circuit de recyclage',
    subtitle: 'Petit problème du support-vie',
    description: 'Une bulle d’air gêne le circuit de filtration de l’eau dans ce scénario.',
    affectedSystemId: 'habitat',
    choices: [
      {
        id: 'flush-pipe',
        label: 'Purger le circuit',
        kidDescription: 'Utilise un peu d’eau propre pour dégager la bulle.',
        tradeoffExplanation: 'Utilise 10 unités d’eau pour rétablir le débit.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, water: Math.max(0, s.resources.water - 10) },
          eventLog: [`Day ${s.day}: Flushed air bubble out of water recycler.`, ...s.eventLog],
        }),
      },
      {
        id: 'low-flow',
        label: 'Recycler à débit réduit',
        kidDescription: 'Fais fonctionner le filtre plus lentement aujourd’hui.',
        tradeoffExplanation: 'Le support-vie passe en mode économie pour aujourd’hui.',
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
    title: '🌱 Nutriments de la serre à vérifier',
    subtitle: 'Équilibre du bac hydroponique',
    description: 'Les plantes de la serre ont besoin d’un mélange nutritif adapté.',
    affectedSystemId: 'greenhouse',
    choices: [
      {
        id: 'boost-minerals',
        label: 'Ajouter des nutriments',
        kidDescription: 'Donne un apport supplémentaire d’eau et de minéraux aux plantes.',
        tradeoffExplanation: 'Coûte 12 unités d’eau, mais produit 15 unités de nourriture en plus.',
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
        label: 'Garder le programme habituel',
        kidDescription: 'Conserve le programme d’arrosage habituel.',
        tradeoffExplanation: 'Aucun coût supplémentaire ; croissance habituelle.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Maintained standard hydroponic feeding.`, ...s.eventLog],
        }),
      },
    ],
  },
  {
    id: 'crew-morale-movie',
    title: '🍿 Moment de détente en équipage',
    subtitle: 'Bien-être et repos de l’équipage',
    description: 'Après une journée chargée, l’équipage souhaite partager un moment de détente.',
    choices: [
      {
        id: 'host-movie',
        label: 'Utiliser l’écran commun',
        kidDescription: 'Utilise un peu d’électricité pour un moment de détente.',
        tradeoffExplanation: 'Coûte 10 unités d’énergie ; le moral de l’équipage reste stable.',
        effect: (s) => ({
          ...s,
          resources: { ...s.resources, energy: Math.max(0, s.resources.energy - 10) },
          crewCondition: s.crewCondition === 'at-risk' ? 'stable' : s.crewCondition,
          eventLog: [`Day ${s.day}: Hosted crew movie night! Crew morale boosted.`, ...s.eventLog],
        }),
      },
      {
        id: 'early-bedtime',
        label: 'Repos et lumières éteintes',
        kidDescription: 'Économise l’énergie et permet à l’équipage de se reposer.',
        tradeoffExplanation: 'Économise l’énergie, sans effet sur le moral.',
        effect: (s) => ({
          ...s,
          eventLog: [`Day ${s.day}: Crew turned lights out early to save power.`, ...s.eventLog],
        }),
      },
    ],
  },
];