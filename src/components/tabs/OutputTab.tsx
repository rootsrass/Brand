import React from 'react';
import { MessageSquare, Calendar, Loader2, CheckCheck, Copy, GitCommitHorizontal } from 'lucide-react';
import { useSwarm } from '../../contexts/SwarmContext';

export default function OutputTab() {
  const { 
    setActiveTab, isGenerating, generatedPosts, setGeneratedPosts, 
    setScheduledPosts, addActivity, commitLogs, setCommitLogs 
  } = useSwarm();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Swarm Output & Scheduler</h2>
            <p className="text-sm text-stone-500">Review generated posts and the end-of-session Memory Commit Logs.</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('calendar')}
          className="flex items-center gap-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          View Distribution Calendar
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-stone-50 rounded-xl p-6 border border-stone-200">
        <div className="flex flex-col gap-6">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-10 text-stone-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p>Swarm agents are drafting content...</p>
            </div>
          )}
          
          {!isGenerating && generatedPosts.map(post => (
            <div key={post.id} className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center bg-stone-100 p-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{post.platform}</span>
                  <span className="text-xs font-medium text-stone-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Sched: Today, 4:00 PM</span>
                </div>
                <div className="flex gap-2">
                  {post.status === 'pending' ? (
                    <button 
                      onClick={() => {
                        setGeneratedPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: 'approved' } : p));
                        setScheduledPosts(prev => [{...post, status: 'scheduled', scheduledTime: 'Today, 4:00 PM'}, ...prev]);
                        addActivity('Distribution Agent', `Scheduled post to ${post.platform}.`);
                      }}
                      className="text-stone-400 hover:text-emerald-600" title="Approve & Schedule"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCheck className="w-3 h-3" /> Scheduled</span>
                  )}
                  <button className="text-stone-400 hover:text-emerald-600"><Copy className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-stone-700 whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          ))}
          
          {!isGenerating && commitLogs.map(log => (
            <div key={log.id} className="bg-stone-900 border border-stone-800 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3 border-b border-stone-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2"><GitCommitHorizontal className="w-4 h-4" /> REPOSITORY COMMIT LOG</span>
                {log.status === 'pending' ? (
                  <button 
                    onClick={() => {
                       setCommitLogs(prev => prev.map(l => l.id === log.id ? { ...l, status: 'pushed' } : l));
                       addActivity('Brand Guardian', `Committed memory log for ${log.date} to repository.`);
                    }}
                    className="text-stone-400 hover:text-emerald-400 text-xs font-mono uppercase bg-stone-800 hover:bg-stone-700 transition-colors px-3 py-1 rounded"
                  >
                    Push to /memory_logs
                  </button>
                ) : (
                  <span className="text-emerald-500 text-xs font-mono uppercase">✔ Pushed</span>
                )}
              </div>
               <pre className="text-xs text-stone-300 font-mono whitespace-pre-wrap">
                  # Memory Commit: {log.date}
                  {"\\n"}
                  {log.content}
                </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
