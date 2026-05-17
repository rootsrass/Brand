import React from 'react';
import { TreePine } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export default function Header() {
  const systemOnline = useUIStore(state => state.systemOnline);
  
  return (
    <header className="bg-emerald-900 text-emerald-50 p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-800 rounded-lg">
          <TreePine className="w-6 h-6 text-emerald-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">EcoManage AI Command Center</h1>
          <p className="text-emerald-300 text-xs font-mono uppercase tracking-wider">GrassRoots LLC Media Swarm // v1.1</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-mono bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-800">
        <div className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
        {systemOnline ? 'SYSTEM ONLINE' : 'OFFLINE'}
      </div>
    </header>
  );
}
