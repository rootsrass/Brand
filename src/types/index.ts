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
  confidence?: number;
  metadata?: {
    locationMatch: boolean;
    nameMatch: boolean;
    phoneMatch: boolean;
    websiteMatch: boolean;
  };
}

export type TabId = 'prompt' | 'workspace' | 'ltm' | 'discovery' | 'entity_resolution' | 'input' | 'output' | 'calendar';
