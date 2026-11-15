import type { MissionConfig } from '../domain/types';

export const LUNAR_SCENARIO: MissionConfig = {
  name: 'Avant-poste lunaire : mission de 30 jours',
  totalDays: 30,
  dailyActionsAllowed: 2,
  enableExtraActions: true,
  resources: [
    { id: 'energy', label: 'Énergie (kWh)', start: 120, max: 200, warnBelow: 30 },
    { id: 'oxygen', label: 'Oxygène (L)', start: 120, max: 200, warnBelow: 30 },
    { id: 'water', label: 'Eau (L)', start: 120, max: 200, warnBelow: 30 },
    { id: 'food', label: 'Rations de nourriture', start: 100, max: 200, warnBelow: 25 },
  ],
  systems: [
    {
      id: 'solar',
      name: 'Champ de panneaux solaires',
      role: 'Produit l’électricité des systèmes de la base',
      effectsByMode: {
        normal: { energy: 45 },
        conserve: { energy: 30 },
        paused: { energy: 0 },
        damaged: { energy: 18 },
      },
      explainer: 'Les panneaux solaires transforment la lumière en électricité, stockée dans les batteries de la base.',
      lessonId: 'power-budgeting',
    },
    {
      id: 'habitat',
      name: 'Habitat et support-vie',
      role: 'Recycle l’air et l’eau pour aider l’équipage à survivre',
      effectsByMode: {
        normal: { energy: -18, oxygen: 8, water: 6 },
        conserve: { energy: -10, oxygen: 5, water: 3 },
        paused: { energy: 0, oxygen: 0, water: 0 },
        damaged: { energy: -20, oxygen: 3, water: 1 },
      },
      explainer: 'Le système de support-vie recycle une partie de l’eau et aide à gérer l’air de l’habitat.',
      lessonId: 'life-support',
    },
    {
      id: 'greenhouse',
      name: 'Serre hydroponique',
      role: 'Fait pousser des plantes pour produire de la nourriture',
      effectsByMode: {
        normal: { energy: -16, water: -7, food: 10, oxygen: 2 },
        conserve: { energy: -8, water: -3, food: 5, oxygen: 1 },
        paused: { energy: 0, water: 0, food: 0, oxygen: 0 },
        damaged: { energy: -15, water: -10, food: 2, oxygen: 0 },
      },
      explainer: 'La serre hydroponique fait pousser des plantes avec de l’eau, de la lumière et des nutriments.',
      lessonId: 'food-production',
    },
  ],
  incidents: [
    { id: 'power-fault-day-4', day: 4, title: 'Panne du réseau électrique', summary: 'Dysfonctionnement d’une connexion des panneaux solaires.' },
    { id: 'solar-storm-day-12', day: 12, title: 'Alerte de particules solaires', summary: 'Augmentation du niveau de radiation solaire.' },
    { id: 'solar-storm-day-22', day: 22, title: 'Alerte de particules solaires', summary: 'Second solar particle surge.' },
  ],
};