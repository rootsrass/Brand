export interface ActivityLog {
  agent: string;
  message: string;
  time: string;
}

export interface Post {
  id: number;
  platform: string;
  content: string;
  status: 'pending' | 'approved' | 'scheduled';
  scheduledTime?: string;
}

export interface CommitLog {
  id: number;
  date: string;
  content: string;
  status: 'pending' | 'pushed';
}

export interface DiscoveryItem {
  id: number;
  type: string;
  source: string;
  content: string;
  insight: string;
}

export type TabId = 'prompt' | 'workspace' | 'ltm' | 'discovery' | 'input' | 'output' | 'calendar';
