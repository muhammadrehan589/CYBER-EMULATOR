'use client';

import React from 'react';
import { useQuizStore } from '@/store/quizStore';
import { Check, X } from 'lucide-react';

export default function LiveLeaderboard() {
  const { score, sessionLogs } = useQuizStore();

  return (
    <div className="w-full h-full flex flex-col p-6 font-mono conic-border-box rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,60,0.2)]">
      <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-8 text-[#ff003c] border-b border-[#ff003c]/30 pb-4">
        Live Intel
      </h2>
      
      <div className="flex items-center justify-between mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
        <span className="text-gray-400 uppercase tracking-widest text-xs">Current Score</span>
        <span className="text-4xl font-black text-white">{score}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-4">Activity Log</h3>
        {sessionLogs.length === 0 ? (
          <p className="text-gray-600 text-sm italic">Awaiting input...</p>
        ) : (
          sessionLogs.map((log, index) => (
            <div key={index} className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">#{index + 1}</span>
                <span className="text-gray-300 text-sm truncate max-w-[150px]">{log.questionId}</span>
              </div>
              <div>
                {log.isCorrect ? (
                  <Check className="w-5 h-5 text-[#00ff88]" />
                ) : (
                  <X className="w-5 h-5 text-[#ff003c]" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
