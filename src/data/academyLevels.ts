import type { AcademyLevelId } from '../features/academy/AcademyProgressContext'

export interface AcademyLevel {
  id: AcademyLevelId
  number: number
  title: string
  subtitle: string
  description: string
  color: string
  icon: string
}

export const ACADEMY_LEVELS: AcademyLevel[] = [
  {
    id: 'earth',
    number: 1,
    title: 'Earth Training',
    subtitle: 'Choose and prepare your astronaut',
    description: 'Discover the mission, spacecraft, space hazards, and the importance of teamwork.',
    color: 'from-blue-500 to-cyan-400',
    icon: '🌍',
  },
  {
    id: 'moon',
    number: 2,
    title: 'Moon Survival',
    subtitle: 'Manage the lunar outpost',
    description: 'Protect the crew and keep the base systems running for 30 simulated days.',
    color: 'from-slate-300 to-blue-400',
    icon: '🌕',
  },
]
