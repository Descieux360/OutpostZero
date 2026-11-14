import type { ClaimKind } from './sources'

export interface Claim {
  kind: ClaimKind
  text: string
  /** Required for 'source-fact'. */
  citation?: { title: string; url: string }
}

export interface LearningCard {
  id: string
  title: string
  /** Which learning objective (spec 4.2) this card serves. */
  objective: string
  summary: string
  claims: Claim[]
}

const CSA_FOOD = { title: 'CSA: Growing healthy food in space and in remote areas', url: 'https://csa-asc.gc.ca/eng/sciences/food-production/growing-healthy-food-in-space-and-remote-areas.asp' }
const CSA_DSFC = { title: 'CSA/Canada.ca: Deep Space Food Challenge announcement (2021-01-12)', url: 'https://www.canada.ca/en/space-agency/news/2021/01/developing-innovative-food-production-technologies-with-the-deep-space-food-challenge.html' }
const DONKI = { title: 'NASA CCMC: DONKI', url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI' }

/**
 * Only claims with kind 'source-fact' are taken from pages we actually read. 'needs-source'
 * marks real-world statements still waiting for a verified citation. Do not upgrade
 * a claim to 'source-fact' without a citation.
 */
export const learningCards: LearningCard[] = [
  {
    id: 'energy-planning',
    title: 'Why power comes first',
    objective: 'Explain why an outpost depends on reliable energy and life-support systems.',
    summary: 'In this game every system draws on one power supply.',
    claims: [
      { kind: 'game-assumption', text: 'In the game, the solar array is the only source of energy. The habitat and the greenhouse both consume it every day.' },
      { kind: 'game-assumption', text: 'If energy runs short, life support and food production are affected too. That is a simplified rule, not a model of a real habitat.' },
      { kind: 'needs-source', text: 'How real lunar outposts generate and budget power. Add a verified reference before stating anything about this.' },
    ],
  },
  {
    id: 'food-needs-inputs',
    title: 'Growing food costs water and energy',
    objective: 'Describe how growing food adds demands on water and energy.',
    summary: 'A greenhouse makes food, but it is not free.',
    claims: [
      { kind: 'source-fact', text: 'The CSA and NASA Deep Space Food Challenge asked teams for food production that needs minimal inputs such as materials, energy and water, while maximizing safe, nutritious food.', citation: CSA_DSFC },
      { kind: 'game-assumption', text: 'In the game the greenhouse consumes water and energy each day and produces food. Pausing it saves both and stops the food. All amounts are game units.' },
    ],
  },
  {
    id: 'plan-stores-and-production',
    title: 'Plan stores and production together',
    objective: 'Recognize that stored resources and production capacity must be planned together.',
    summary: 'Supplies on hand only help until they run out.',
    claims: [
      { kind: 'source-fact', text: 'The CSA says missions to farther destinations like the Moon or Mars will need crews to be more self-sufficient, because resupply trips become less frequent or impossible.', citation: CSA_FOOD },
      { kind: 'game-assumption', text: 'In the game you start with fixed stores and each day systems add to them or use them up. Over seven days, a small daily shortfall adds up. The numbers are mock values.' },
    ],
  },
  {
    id: 'radiation-shelter',
    title: 'Solar storms and shelter',
    objective: 'Explain, at an introductory level, why radiation shielding and reducing exposure during a solar event matter.',
    summary: 'Why the habitat has a shielded area, and what sheltering costs.',
    claims: [
      { kind: 'source-fact', text: 'DONKI catalogs space-weather events, including solar flares, solar energetic particle events and coronal mass ejections.', citation: DONKI },
      { kind: 'source-fact', text: 'The DONKI page says its real-time information should be treated as prototyping quality, for research context.', citation: DONKI },
      { kind: 'game-assumption', text: 'In the game, moving the crew to the shielded area protects them during the storm, and non-essential work pauses as the trade-off. This is a game rule, not real astronaut guidance.' },
      { kind: 'needs-source', text: 'Why shielding reduces radiation exposure, and real dose figures. RadLab and OSDR have not been reviewed yet. ISS measurements must not be presented as lunar surface values.' },
    ],
  },
  {
    id: 'knock-on-effects',
    title: 'One fault, many problems',
    objective: 'Identify how a shortage or system fault can create knock-on effects across the outpost.',
    summary: 'Systems depend on each other, so a single failure spreads.',
    claims: [
      { kind: 'game-assumption', text: 'In the game, a damaged solar array lowers energy, which limits life support and the greenhouse. Protecting one reserve can drain another.' },
      { kind: 'needs-source', text: 'A real example of a cascading failure in a space habitat. Find and cite one before using it.' },
    ],
  },
]

export const getLearningCard = (id: string) => learningCards.find((c) => c.id === id)