import React, { useState } from 'react';
import { Globe, RefreshCcw, Search, XCircle, ThumbsUp, Edit2, Save } from 'lucide-react';
import { useContentStore } from '../../stores/contentStore';
import { useAgentStore } from '../../stores/agentStore';

export default function DiscoveryTab() {
  const ltmStatus = useContentStore(state => state.ltmStatus);
  const handleAutoDiscover = useContentStore(state => state.handleAutoDiscover);
  const discoveryQueue = useContentStore(state => state.discoveryQueue);
  const setDiscoveryQueue = useContentStore(state => state.setDiscoveryQueue);
  
  const discoveryLogs = useAgentStore(state => state.discoveryLogs);
  const addActivity = useAgentStore(state => state.addActivity);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (id: number, currentInsight: string) => {
    setEditingId(id);
    setEditValue(currentInsight);
  };

  const saveEdit = (id: number) => {
    setDiscoveryQueue(q => q.map(item => item.id === id ? { ...item, insight: editValue } : item));
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px] overflow-hidden">
       <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Discovery Engine Output</h2>
            <p className="text-sm text-stone-500">Review assets scraped from external platforms.</p>
          </div>
        </div>
        <button
            onClick={handleAutoDiscover}
            disabled={ltmStatus === 'discovering'}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {ltmStatus === 'discovering' ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {ltmStatus === 'discovering' ? 'Scanning...' : 'Run Targeted Scan'}
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Scraping Terminal */}
        <div className="bg-stone-900 rounded-xl p-4 flex flex-col font-mono text-xs overflow-hidden">
          <div className="text-stone-500 mb-2 border-b border-stone-800 pb-2 flex justify-between">
             <span>discovery_agent_daemon.sh</span>
             <span className="text-green-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-stone-300">
            {discoveryLogs.length === 0 ? (
              <span className="text-stone-600">Awaiting scan command...</span>
            ) : (
              discoveryLogs.map((log, idx) => (
                <div key={idx} className={`${log.includes('[SUCCESS]') ? 'text-green-400' : log.includes('[INFO]') ? 'text-blue-300' : 'text-stone-300'}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Queue UI */}
        <div className="flex flex-col bg-stone-50 rounded-xl border border-stone-200 overflow-hidden text-sm">
          <div className="p-3 border-b border-stone-200 font-bold text-stone-700 bg-stone-100 shrink-0">
             Human Approval Queue ({discoveryQueue.length})
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {discoveryQueue.length === 0 ? (
               <div className="text-center text-stone-500 mt-10">Queue is empty.</div>
             ) : (
               discoveryQueue.map(item => (
                 <div key={item.id} className="bg-white border border-stone-200 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded uppercase">{item.source} • {item.type}</span>
                         {item.confidence && (
                           <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.confidence > 90 ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'}`}>
                             {item.confidence}% Match
                           </span>
                         )}
                       </div>
                       <div className="flex gap-1">
                          <button 
                             onClick={() => setDiscoveryQueue(q => q.filter(qItem => qItem.id !== item.id))}
                             className="p-1 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Reject">
                             <XCircle className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => {
                                setDiscoveryQueue(q => q.filter(qItem => qItem.id !== item.id));
                                addActivity('Brand Guardian', `Ingested ${item.type} into LTM: ${item.source}`);
                             }}
                             className="p-1 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Approve">
                             <ThumbsUp className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                    {item.metadata && (
                      <div className="flex gap-2 mb-2 text-[10px] font-mono text-stone-500 uppercase">
                        <span className={item.metadata.locationMatch ? "text-green-600" : "text-stone-400"}>
                          [{item.metadata.locationMatch ? '✔' : '✖'} Loc]
                        </span>
                        <span className={item.metadata.nameMatch ? "text-green-600" : "text-stone-400"}>
                          [{item.metadata.nameMatch ? '✔' : '✖'} Name]
                        </span>
                        <span className={item.metadata.phoneMatch ? "text-green-600" : "text-stone-400"}>
                          [{item.metadata.phoneMatch ? '✔' : '✖'} Phone]
                        </span>
                        <span className={item.metadata.websiteMatch ? "text-green-600" : "text-stone-400"}>
                          [{item.metadata.websiteMatch ? '✔' : '✖'} Web]
                        </span>
                      </div>
                    )}
                    <p className="text-stone-800 font-medium mb-2">"{item.content}"</p>
                    
                    {editingId === item.id ? (
                      <div className="flex gap-2 items-center bg-stone-100 p-2 rounded-lg">
                        <input 
                          type="text" 
                          value={editValue} 
                          onChange={e => setEditValue(e.target.value)}
                          className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                        />
                        <button onClick={() => saveEdit(item.id)} className="text-emerald-600 hover:text-emerald-700">
                           <Save className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-start group">
                        <p className="text-stone-500 text-xs italic flex-1">Insight: {item.insight}</p>
                        <button onClick={() => startEditing(item.id, item.insight)} className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-600 transition-opacity">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
