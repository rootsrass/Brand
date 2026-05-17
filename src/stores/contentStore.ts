import { create } from 'zustand';
import { Post, CommitLog, DiscoveryItem } from '../types';
import { useAgentStore } from './agentStore';
import { useUIStore } from './uiStore';

interface ContentState {
  ltmInput: string;
  setLtmInput: (val: string) => void;
  ltmStatus: 'idle' | 'processing' | 'success' | 'discovering';
  setLtmStatus: (status: 'idle' | 'processing' | 'success' | 'discovering') => void;
  handleInitializeSwarm: () => void;
  
  isGithubSyncing: boolean;
  handleGithubSync: () => void;

  isGithubSettingUp: boolean;
  handleGithubSetup: () => void;

  isGeneratingCommit: boolean;
  commitLog: string;
  handleGenerateCommit: () => void;

  discoveryQueue: DiscoveryItem[];
  setDiscoveryQueue: (updater: DiscoveryItem[] | ((prev: DiscoveryItem[]) => DiscoveryItem[])) => void;
  handleAutoDiscover: () => void;

  fieldNotes: string;
  setFieldNotes: (val: string) => void;
  isGenerating: boolean;
  handleDispatch: () => void;

  generatedPosts: Post[];
  setGeneratedPosts: (updater: Post[] | ((prev: Post[]) => Post[])) => void;
  scheduledPosts: Post[];
  setScheduledPosts: (updater: Post[] | ((prev: Post[]) => Post[])) => void;
  commitLogs: CommitLog[];
  setCommitLogs: (updater: CommitLog[] | ((prev: CommitLog[]) => CommitLog[])) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  ltmInput: '',
  setLtmInput: (val) => set({ ltmInput: val }),
  ltmStatus: 'idle',
  setLtmStatus: (status) => set({ ltmStatus: status }),
  handleInitializeSwarm: async () => {
    const state = get();
    if (!state.ltmInput.trim()) return;
    set({ ltmStatus: 'processing' });
    useAgentStore.getState().addActivity('Brand Guardian', 'Ingesting new context summary into Long-Term Memory...');
    
    try {
      const resp = await fetch('/api/ltm/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: state.ltmInput })
      });
      const data = await resp.json();
      set({ ltmStatus: 'success', ltmInput: '' }); 
      useAgentStore.getState().addActivity('Brand Guardian', data.message || 'Memory successfully verified and locked.');
    } catch (e) {
      set({ ltmStatus: 'idle' });
      useAgentStore.getState().addActivity('Brand Guardian', 'Ingestion failed check console logs.');
    }
  },

  isGithubSyncing: false,
  handleGithubSync: async () => {
    set({ isGithubSyncing: true });
    useAgentStore.getState().addActivity('Brand Guardian', 'Syncing LTM context from GitHub Repository (rootsrass/Brand)...');
    
    try {
      const resp = await fetch('/api/ltm/github');
      const data = await resp.json();
      set({ isGithubSyncing: false });
      
      if (data.success && data.content) {
         set({ ltmInput: data.content });
         useAgentStore.getState().addActivity('Brand Guardian', 'Successfully retrieved remote context. Ready for initialization.');
      } else {
         useAgentStore.getState().addActivity('Brand Guardian', `GitHub Sync Failed: ${data.message}`);
      }
    } catch(e) {
      set({ isGithubSyncing: false });
      useAgentStore.getState().addActivity('Brand Guardian', 'GitHub Sync encountered a network error.');
    }
  },

  isGithubSettingUp: false,
  handleGithubSetup: async () => {
    set({ isGithubSettingUp: true });
    useAgentStore.getState().addActivity('Brand Guardian', 'Initializing master architecture in GitHub LTM (rootsrass/Brand)...');
    
    try {
      const resp = await fetch('/api/ltm/github/setup', { method: 'POST' });
      const data = await resp.json();
      set({ isGithubSettingUp: false });
      
      if (data.success) {
         useAgentStore.getState().addActivity('Brand Guardian', 'Successfully initialized GitHub directory structure. Ready for sync.');
      } else {
         useAgentStore.getState().addActivity('Brand Guardian', `GitHub Setup Failed: ${data.message}`);
      }
    } catch(e) {
      set({ isGithubSettingUp: false });
      useAgentStore.getState().addActivity('Brand Guardian', 'GitHub Setup encountered a network error.');
    }
  },

  isGeneratingCommit: false,
  commitLog: '',
  handleGenerateCommit: async () => {
    set({ isGeneratingCommit: true, commitLog: '' });
    useAgentStore.getState().addActivity('Brand Guardian', 'Generating End-of-Session Commit Log...');
    
    const activityLog = useAgentStore.getState().activities.map(a => `[${a.timestamp}] ${a.agentName}: ${a.message}`).join('\\n');
    
    try {
      const resp = await fetch('/api/ltm/commit', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ activityLog })
      });
      const data = await resp.json();
      set({ isGeneratingCommit: false, commitLog: data.commitLog || 'Failed to generate commit log.' });
    } catch (e) {
      set({ isGeneratingCommit: false, commitLog: '**Error:** Network failure.' });
    }
  },

  discoveryQueue: [],
  setDiscoveryQueue: (updater) => set((state) => ({
    discoveryQueue: typeof updater === 'function' ? updater(state.discoveryQueue) : updater
  })),
  handleAutoDiscover: async () => {
    set({ ltmStatus: 'discovering' });
    useUIStore.getState().setActiveTab('discovery');
    const agentStore = useAgentStore.getState();
    agentStore.addActivity('Discovery Agent', 'Initiating wide-area net scan for GrassRoots LLC assets...');
    agentStore.setDiscoveryLogs([]);
    
    try {
      const response = await fetch('/api/discovery', { method: 'POST' });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(Boolean);
            for (const line of lines) {
              try {
                const parsed = JSON.parse(line);
                agentStore.setDiscoveryLogs(prev => [...prev, parsed.log]);
                if (parsed.data) {
                  set({ discoveryQueue: parsed.data.queue, ltmStatus: 'idle' });
                  agentStore.addActivity('Discovery Agent', 'Staged verified assets in the Discovery Queue.');
                }
              } catch (parseError) {
                // Handle incomplete JSON chunks if any
                 console.error("JSON parse error:", parseError, line);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      set({ ltmStatus: 'idle' });
    }
  },

  fieldNotes: '',
  setFieldNotes: (val) => set({ fieldNotes: val }),
  isGenerating: false,
  handleDispatch: async () => {
    const state = get();
    if (!state.fieldNotes.trim()) return;
    set({ isGenerating: true });
    const agentStore = useAgentStore.getState();
    agentStore.addActivity('Copywriter Agent', 'Received field notes. Drafting cross-platform variations...');
    agentStore.addActivity('Omnichannel Distro', 'Analyzing best platforms for visual assets.');
    useUIStore.getState().setActiveTab('output');
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldNotes: state.fieldNotes })
      });
      const data = await response.json();
      
      if (data.post && data.log) {
        set((s) => ({ generatedPosts: [data.post, ...s.generatedPosts] }));
        set((s) => ({ commitLogs: [data.log, ...s.commitLogs] }));
      }
      
      set({ isGenerating: false, fieldNotes: '' });
      agentStore.addActivity('Brand Guardian', 'New generated content passes brand check. Awaiting human approval.');
    } catch (e) {
       console.error(e);
       set({ isGenerating: false });
    }
  },

  generatedPosts: [
    {
      id: 1,
      platform: 'FACEBOOK / NEXTDOOR',
      content: `Another beautiful driveway expansion completed right here in New Smyrna Beach! 🌴 \n\nWe used premium sandstone pavers to totally transform the entrance, adding serious curb appeal just in time for summer. \n\nNeed a property facelift or tree service in Volusia county? Give us a call at [INSERT PHONE] or visit our website. \n\n#NewSmyrnaBeach #VolusiaCounty #Landscaping #Pavers`,
      status: 'pending'
    }
  ],
  setGeneratedPosts: (updater) => set((s) => ({
    generatedPosts: typeof updater === 'function' ? updater(s.generatedPosts) : updater
  })),
  scheduledPosts: [],
  setScheduledPosts: (updater) => set((s) => ({
    scheduledPosts: typeof updater === 'function' ? updater(s.scheduledPosts) : updater
  })),
  commitLogs: [
    {
      id: 1,
      date: '2026-05-17',
      content: `**New Content Created:**\n- 1x Facebook conversational post (Sandstone Paver Driveway)\n- 1x Instagram visual post (Sandstone Paver Driveway)\n\n**Platforms Targeted:** Facebook, Nextdoor, Instagram\n\n**Insights/SEO Keywords Used:** "driveway expansion", "sandstone pavers", "New Smyrna Beach", "Volusia county landscape"\n\n**Next Steps:** Recommend gathering video of the next retaining wall project for TikTok/Reels test.`,
      status: 'pending'
    }
  ],
  setCommitLogs: (updater) => set((s) => ({
    commitLogs: typeof updater === 'function' ? updater(s.commitLogs) : updater
  }))
}));
