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
    title: 'Entraînement sur Terre',
    subtitle: 'Choisir et préparer l’astronaute',
    description: 'Découvre la mission, les vaisseaux, les dangers de l’espace et l’esprit d’équipe.',
    color: 'from-blue-500 to-cyan-400',
    icon: '🌍',
  },
  {
    id: 'moon',
    number: 2,
    title: 'Survie sur la Lune',
    subtitle: 'Gérer l’avant-poste lunaire',
    description: 'Protège l’équipage et maintiens les systèmes de la base pendant 30 jours simulés.',
    color: 'from-slate-300 to-blue-400',
    icon: '🌕',
  },
  {
    id: 'mars',
    number: 3,
    title: 'Survie sur Mars',
    subtitle: 'Préparer une mission lointaine',
    description: 'Prends des décisions pour installer une base et protéger l’équipage martien.',
    color: 'from-orange-500 to-red-500',
    icon: '🔴',
  },
]
