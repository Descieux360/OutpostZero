import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import type { MissionState } from '../../domain/types'
import { initialMission, missionReducer, type MissionAction } from './missionReducer'

interface MissionContextValue {
  state: MissionState
  dispatch: Dispatch<MissionAction>
}

const MissionContext = createContext<MissionContextValue | null>(null)

/** Lives above the router's routes, so mission state survives page changes. */
export function MissionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(missionReducer, undefined, initialMission)
  return <MissionContext.Provider value={{ state, dispatch }}>{children}</MissionContext.Provider>
}

export function useMission() {
  const ctx = useContext(MissionContext)
  if (!ctx) throw new Error('useMission must be used inside <MissionProvider>')
  return ctx
}
