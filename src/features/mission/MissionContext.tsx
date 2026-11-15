import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { MissionState, MissionConfig } from '../../domain/types';
import { missionReducer, initialMission, type MissionAction } from './missionReducer';
import { LUNAR_SCENARIO } from '../../data/lunarScenario';

interface MissionContextType {
  state: MissionState;
  config: MissionConfig;
  dispatch: React.Dispatch<MissionAction>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(missionReducer, initialMission);

  return (
    <MissionContext.Provider value={{ state, config: LUNAR_SCENARIO, dispatch }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};