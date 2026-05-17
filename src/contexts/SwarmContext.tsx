import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ActivityLog, Post, CommitLog, DiscoveryItem, TabId } from '../types';

interface SwarmContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  systemOnline: boolean;
  activityFeed: ActivityLog[];
  addActivity: (agent: string, message: string) => void;
  
  // LTM State
  ltmInput: string;
  setLtmInput: (val: string) => void;
  ltmStatus: 'idle' | 'processing' | 'success' | 'discovering';
  handleInitializeSwarm: () => void;
  
  // Discovery State
  discoveryQueue: DiscoveryItem[];
  setDiscoveryQueue: React.Dispatch<React.SetStateAction<DiscoveryItem[]>>;
  discoveryLogs: string[];
  handleAutoDiscover: () => void;
  
  // Input/Output State
  fieldNotes: string;
  setFieldNotes: (val: string) => void;
  isGenerating: boolean;
  handleDispatch: () => void;
  
  generatedPosts: Post[];
  setGeneratedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  scheduledPosts: Post[];
  setScheduledPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  commitLogs: CommitLog[];
  setCommitLogs: React.Dispatch<React.SetStateAction<CommitLog[]>>;
}

const SwarmContext = createContext<SwarmContextType | undefined>(undefined);

export const SwarmProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabId>('prompt');
  const [systemOnline, setSystemOnline] = useState(true);
  
  const [activityFeed, setActivityFeed] = useState<ActivityLog[]>([
    { agent: 'System', message: 'EcoManage AI Swarm Initialized.', time: '08:00' }
  ]);
  
  const addActivity = (agent: string, message: string) => {
    setActivityFeed(prev => [...prev, { agent, message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
  };

  // LTM State
  const [ltmInput, setLtmInput] = useState('');
  const [ltmStatus, setLtmStatus] = useState<'idle' | 'processing' | 'success' | 'discovering'>('idle');
  
  const handleInitializeSwarm = () => {
    if (!ltmInput.trim()) return;
    setLtmStatus('processing');
    addActivity('Brand Guardian', 'Ingesting new context summary into Long-Term Memory...');
    setTimeout(() => {
      setLtmStatus('success');
      addActivity('Brand Guardian', 'Memory successfully verified and locked.');
    }, 1500);
  };

  // Discovery State
  const [discoveryQueue, setDiscoveryQueue] = useState<DiscoveryItem[]>([]);
  const [discoveryLogs, setDiscoveryLogs] = useState<string[]>([]);
  
  const handleAutoDiscover = () => {
    setLtmStatus('discovering');
    setActiveTab('discovery');
    addActivity('Discovery Agent', 'Initiating wide-area net scan for GrassRoots LLC assets...');
    
    setDiscoveryLogs(['[INFO] Scraping Google Maps Local for reviews...']);
    setTimeout(() => setDiscoveryLogs(prev => [...prev, '[INFO] Found 14 reviews. Parsing sentiment...']), 800);
    setTimeout(() => setDiscoveryLogs(prev => [...prev, '[INFO] Scanning Nextdoor New Smyrna Beach neighborhood...']), 1600);
    setTimeout(() => setDiscoveryLogs(prev => [...prev, '[SUCCESS] Extracted "Sandstone Pavers" keyword trend.']), 2400);
    setTimeout(() => {
      setDiscoveryLogs(prev => [...prev, '[COMPLETE] Scan finished. Staging items for human approval.']);
      setLtmStatus('idle');
      setDiscoveryQueue([
        { id: 1, type: 'Review', source: 'Google Local', content: '"They did an amazing job on our driveway expansion! Highly recommend." - Sarah T.', insight: 'Use for upcoming Paver Campaign.' },
        { id: 2, type: 'Trend', source: 'Nextdoor (NSB)', content: 'Spike in mentions for "Hurricane Prep Tree Trimming"', insight: 'Create urgency post about storm season.' },
        { id: 3, type: 'Asset', source: 'Legacy Yelp Page', content: '[Discovered 3 lo-res images of past retaining wall jobs]', insight: 'Needs human verification before LTM ingestion.' }
      ]);
      addActivity('Discovery Agent', 'Staged 3 new assets in the Discovery Queue.');
    }, 3200);
  };

  // Input/Output State
  const [fieldNotes, setFieldNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([
    {
      id: 1,
      platform: 'FACEBOOK / NEXTDOOR',
      content: `Another beautiful driveway expansion completed right here in New Smyrna Beach! 🌴 \n\nWe used premium sandstone pavers to totally transform the entrance, adding serious curb appeal just in time for summer. \n\nNeed a property facelift or tree service in Volusia county? Give us a call at [INSERT PHONE] or visit our website. \n\n#NewSmyrnaBeach #VolusiaCounty #Landscaping #Pavers`,
      status: 'pending'
    }
  ]);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [commitLogs, setCommitLogs] = useState<CommitLog[]>([
    {
      id: 1,
      date: '2026-05-17',
      content: `**New Content Created:**\n- 1x Facebook conversational post (Sandstone Paver Driveway)\n- 1x Instagram visual post (Sandstone Paver Driveway)\n\n**Platforms Targeted:** Facebook, Nextdoor, Instagram\n\n**Insights/SEO Keywords Used:** "driveway expansion", "sandstone pavers", "New Smyrna Beach", "Volusia county landscape"\n\n**Next Steps:** Recommend gathering video of the next retaining wall project for TikTok/Reels test.`,
      status: 'pending'
    }
  ]);

  const handleDispatch = () => {
    if (!fieldNotes.trim()) return;
    setIsGenerating(true);
    addActivity('Copywriter Agent', 'Received field notes. Drafting cross-platform variations...');
    addActivity('Omnichannel Distro', 'Analyzing best platforms for visual assets.');
    setActiveTab('output');
    
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now(),
        platform: 'INSTAGRAM / TIKTOK',
        content: `Transforming outdoor spaces one day at a time! 🌿✨\n\n${fieldNotes.slice(0, 50)}...\n\nSwipe to see the before and after! 👉\n\n#Landscaping #Hardscape #NewSmyrnaBeach #GrassRootsLLC`,
        status: 'pending'
      };
      setGeneratedPosts(prev => [newPost, ...prev]);
      
      const newLog: CommitLog = {
        id: Date.now() + 1,
        date: new Date().toISOString().split('T')[0],
        content: `**New Content Created:**\n- 1x Instagram visual post based on recent field notes\n\n**Insights Used:** Automatically extracted from user input.\n\n**Next Steps:** Monitor engagement for local reach.`,
        status: 'pending'
      };
      setCommitLogs(prev => [newLog, ...prev]);

      setIsGenerating(false);
      addActivity('Brand Guardian', 'New generated content passes brand check. Awaiting human approval.');
      setFieldNotes('');
    }, 2500);
  };

  return (
    <SwarmContext.Provider value={{
      activeTab, setActiveTab,
      systemOnline,
      activityFeed, addActivity,
      ltmInput, setLtmInput, ltmStatus, handleInitializeSwarm,
      discoveryQueue, setDiscoveryQueue, discoveryLogs, handleAutoDiscover,
      fieldNotes, setFieldNotes, isGenerating, handleDispatch,
      generatedPosts, setGeneratedPosts, scheduledPosts, setScheduledPosts,
      commitLogs, setCommitLogs
    }}>
      {children}
    </SwarmContext.Provider>
  );
};

export const useSwarm = () => {
  const context = useContext(SwarmContext);
  if (context === undefined) {
    throw new Error('useSwarm must be used within a SwarmProvider');
  }
  return context;
};
