import { create } from 'zustand';
import { TabId } from '../types';

interface UIState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  systemOnline: boolean;
  setSystemOnline: (status: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'prompt',
  setActiveTab: (tab) => set({ activeTab: tab }),
  systemOnline: true,
  setSystemOnline: (status) => set({ systemOnline: status })
}));
