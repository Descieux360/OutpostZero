export type ResourceName = 'energy' | 'oxygen' | 'water' | 'food';
export type CrewCondition = 'stable' | 'at-risk' | 'critical';
export type MissionStatus = 'briefing' | 'active' | 'completed' | 'failed';
export type SystemMode = 'normal' | 'conserve' | 'paused' | 'damaged';
export type SystemId = 'solar' | 'habitat' | 'greenhouse';
export type DonkiEndpoint = 'SEP' | 'CME';
export type RadiationStatus = 'unaffected' | 'protected' | 'exposed';

export type Resources = Record<ResourceName, number>;

export interface DecisionRecord {
  day: number;
  eventId: string;
  choiceId: string;
  summary: string;
}

export interface MissionState {
  day: number;
  resources: Resources;
  crewCondition: CrewCondition;
  missionStatus: MissionStatus;
  systemModes: Record<SystemId, SystemMode>;
  actionsLeft: number;
  pendingEventId?: string;
  eventLog: string[];
  history: Array<{ day: number; resources: Resources }>;
  decisions: DecisionRecord[];
  seed: number;
  rngState: number;
  radiation: RadiationStatus;
  realEventId?: string;
  scienceScore?: number;
}

export interface SystemConfig {
  id: SystemId;
  name: string;
  role: string;
  effectsByMode: Partial<Record<SystemMode, Partial<Resources>>>;
  explainer: string;
  lessonId?: string;
}

export interface ResourceConfig {
  id: ResourceName;
  label: string;
  start: number;
  max: number;
  warnBelow: number;
}

export interface ScheduledIncident {
  id: string;
  day: number;
  title: string;
  summary: string;
}

export interface MissionConfig {
  name: string;
  totalDays: number;
  dailyActionsAllowed: number;
  enableExtraActions?: boolean;
  resources: ResourceConfig[];
  systems: SystemConfig[];
  incidents: ScheduledIncident[];
}