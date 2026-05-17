import React from 'react';
import { CalendarRange, Calendar, Clock } from 'lucide-react';
import { useSwarm } from '../../contexts/SwarmContext';

export default function CalendarTab() {
  const { scheduledPosts } = useSwarm();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col h-[600px]">
       <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-3">
          <CalendarRange className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Distribution Calendar</h2>
            <p className="text-sm text-stone-500">Upcoming scheduled posts managed by the Omnichannel Distro agent.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-stone-50 rounded-xl p-6 border border-stone-200">
        <div className="flex flex-col gap-4">
          {scheduledPosts.length === 0 ? (
             <div className="flex flex-col flex-1 items-center justify-center text-center text-stone-500 py-10 mt-10">
                <Calendar className="w-12 h-12 text-stone-300 mb-4" />
                <p className="text-lg font-medium text-stone-600 mb-2">No Scheduled Posts</p>
                <p className="text-sm max-w-md mx-auto">Generate content from field notes and approve them to see them scheduled here.</p>
             </div>
          ) : (
            scheduledPosts.map((post, idx) => (
              <div key={idx} className="bg-white border-l-4 border-emerald-500 rounded-r-lg shadow-sm p-4 flex gap-4">
                <div className="flex flex-col items-center justify-center bg-stone-100 rounded-lg p-3 min-w-[100px] text-center">
                  <Clock className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-sm font-bold text-stone-800">{post.scheduledTime?.split(',')[1]}</span>
                  <span className="text-xs text-stone-500">{post.scheduledTime?.split(',')[0]}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-blue-600 mb-1">{post.platform}</span>
                  <p className="text-sm text-stone-700 line-clamp-2">{post.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
