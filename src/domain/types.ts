export type ResourceName = 'energy' | 'oxygen' | 'water' | 'food'
export type CrewCondition = 'stable' | 'at-risk' | 'critical'
export type MissionStatus = 'briefing' | 'active' | 'completed' | 'failed'
export type SystemMode = 'normal' | 'conserve' | 'paused' | 'damaged'
export type SystemId = 'solar' | 'habitat' | 'greenhouse'
export type DonkiEndpoint = 'SEP' | 'CME'


export type Resources = Record<ResourceName, number>

export interface MissionState {
  day: number
  resources: Resources
  crewCondition: CrewCondition
  missionStatus: MissionStatus
  systemModes: Record<SystemId, SystemMode>
  pendingEventId?: string
  eventLog: string[]
  history: Array<{ day: number; resources: Resources }>
}

export interface SystemConfig {
  id: SystemId
  name: string
  role: string
  /** Per-day change in GAME UNITS while in each mode. Missing mode = no effect. */
  effectsByMode: Partial<Record<SystemMode, Partial<Resources>>>
  explainer: string
}

export interface ResourceConfig {
  id: ResourceName
  label: string
  start: number
  max: number
  /** Below this the resource is flagged "at risk". Game assumption. */
  warnBelow: number
}

export interface ScheduledIncident {
  id: string
  day: number
  title: string
  summary: string
}

export interface MissionConfig {
  name: string
  totalDays: number
  resources: ResourceConfig[]
  systems: SystemConfig[]
  incidents: ScheduledIncident[]
}
