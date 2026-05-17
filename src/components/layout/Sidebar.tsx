import React from 'react';
import { 
  Terminal, FolderTree, BookOpen, Globe, 
  Image as ImageIcon, MessageSquare, CalendarRange, Activity 
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAgentStore } from '../../stores/agentStore';
import { TabId } from '../../types';

export default function Sidebar() {
  const activeTab = useUIStore(state => state.activeTab);
  const setActiveTab = useUIStore(state => state.setActiveTab);
  const activityFeed = useAgentStore(state => state.activityFeed);

  const navItems: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'prompt', label: 'Master System Prompt', icon: Terminal },
    { id: 'workspace', label: 'Repository Workspace', icon: FolderTree },
    { id: 'ltm', label: 'Brand LTM State', icon: BookOpen },
    { id: 'discovery', label: 'Discovery Engine', icon: Globe },
    { id: 'input', label: 'Field Notes & Media', icon: ImageIcon },
    { id: 'output', label: 'Generated Output', icon: MessageSquare },
    { id: 'calendar', label: 'Distribution Calendar', icon: CalendarRange },
  ];

  return (
    <aside className="lg:col-span-1 space-y-2">
      <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 px-2">Swarm Modules</h2>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === item.id ? 'bg-white shadow-sm border border-stone-200 text-emerald-800 font-medium' : 'hover:bg-stone-200 text-stone-600'}`}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        );
      })}

      <div className="pt-4 pb-2">
        <div className="h-px bg-stone-200 w-full" />
      </div>
      <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 px-2">Active Agents</h2>

      <div className="space-y-1 mb-6">
        <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
          <span>Copywriter Agent</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
          <span>Omnichannel Distro</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          <span>Brand Guardian</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 text-stone-500 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
          <span>Digital Discovery Agent</span>
        </div>
      </div>

      {/* Live Swarm Activity Feed */}
      <div className="bg-stone-200/50 rounded-xl p-4 border border-stone-200">
         <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
           <Activity className="w-4 h-4" /> Live Swarm Logs
         </h2>
         <div className="space-y-3 h-48 overflow-y-auto pr-1 custom-scrollbar flex flex-col-reverse">
           {[...activityFeed].reverse().map((log, i) => {
             let agentColor = 'text-stone-700'; // default
             if (log.agent === 'Copywriter Agent') agentColor = 'text-blue-700';
             if (log.agent === 'Omnichannel Distro') agentColor = 'text-purple-700';
             if (log.agent === 'Brand Guardian') agentColor = 'text-amber-700';
             if (log.agent === 'Discovery Agent') agentColor = 'text-rose-700';
             
             return (
               <div key={i} className="text-xs">
                 <div className="flex justify-between items-center text-stone-400 mb-0.5">
                   <span className={`font-bold ${agentColor}`}>{log.agent}</span>
                   <span>{log.time}</span>
                 </div>
                 <p className="text-stone-600 leading-snug">{log.message}</p>
               </div>
             );
           })}
         </div>
      </div>
    </aside>
  );
}
