import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type AcademyLevelId = 'earth' | 'moon' | 'mars'
export type AstronautRole = 'navigation' | 'ingenierie' | 'sciences'

interface AcademyProgress {
  earthPassed: boolean
  moonPassed: boolean
  marsPassed: boolean
  marsMissionComplete: boolean
  astronautName: string
  astronautRole: AstronautRole | null
  earthModulesCompleted: string[]
  stars: Record<AcademyLevelId, number>
}

interface AcademyProgressValue extends AcademyProgress {
  completeModule: (moduleId: string) => void
  selectAstronaut: (name: string, role: AstronautRole) => void
  completeLevel: (levelId: AcademyLevelId) => void
  completeMarsMission: () => void
  resetProgress: () => void
}

const STORAGE_KEY = 'space-academy-progress-v1'
const initialProgress: AcademyProgress = {
  earthPassed: false,
  moonPassed: false,
  marsPassed: false,
  marsMissionComplete: false,
  astronautName: '',
  astronautRole: null,
  earthModulesCompleted: [],
  stars: { earth: 0, moon: 0, mars: 0 },
}

function readProgress(): AcademyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialProgress
    const parsed = JSON.parse(raw) as Partial<AcademyProgress>
    return {
      ...initialProgress,
      ...parsed,
      earthModulesCompleted: Array.isArray(parsed.earthModulesCompleted) ? parsed.earthModulesCompleted : [],
      stars: { ...initialProgress.stars, ...parsed.stars },
    }
  } catch {
    return initialProgress
  }
}

const AcademyProgressContext = createContext<AcademyProgressValue | null>(null)

export function AcademyProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<AcademyProgress>(readProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const value = useMemo<AcademyProgressValue>(() => ({
    ...progress,
    completeModule: (moduleId) => setProgress((current) => ({
      ...current,
      earthModulesCompleted: current.earthModulesCompleted.includes(moduleId)
        ? current.earthModulesCompleted
        : [...current.earthModulesCompleted, moduleId],
    })),
    selectAstronaut: (name, role) => setProgress((current) => ({ ...current, astronautName: name, astronautRole: role })),
    completeLevel: (levelId) => setProgress((current) => {
      const key = `${levelId}Passed` as 'earthPassed' | 'moonPassed' | 'marsPassed'
      const alreadyPassed = current[key]
      return {
        ...current,
        [key]: true,
        stars: { ...current.stars, [levelId]: alreadyPassed ? current.stars[levelId] : 1 },
      }
    }),
    completeMarsMission: () => setProgress((current) => ({ ...current, marsMissionComplete: true })),
    resetProgress: () => setProgress(initialProgress),
  }), [progress])

  return <AcademyProgressContext.Provider value={value}>{children}</AcademyProgressContext.Provider>
}

export function useAcademyProgress() {
  const context = useContext(AcademyProgressContext)
  if (!context) throw new Error('useAcademyProgress must be used inside AcademyProgressProvider')
  return context
}
