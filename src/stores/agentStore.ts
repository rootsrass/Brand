import { create } from 'zustand';
import { ActivityLog } from '../types';

interface AgentState {
  activityFeed: ActivityLog[];
  addActivity: (agent: string, message: string) => void;
  discoveryLogs: string[];
  setDiscoveryLogs: (updater: string[] | ((prev: string[]) => string[])) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activityFeed: [{ agent: 'System', message: 'EcoManage AI Swarm Initialized.', time: '08:00' }],
  addActivity: (agent, message) => set((state) => ({
    activityFeed: [...state.activityFeed, { agent, message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]
  })),
  discoveryLogs: [],
  setDiscoveryLogs: (updater) => set((state) => ({
    discoveryLogs: typeof updater === 'function' ? updater(state.discoveryLogs) : updater
  }))
}));
