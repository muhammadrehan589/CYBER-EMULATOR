'use client';

import React, { useState, useEffect } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { Check, X, ShieldAlert } from 'lucide-react';
import { io, Socket } from 'socket.io-client';



import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { useLeaderboard } from '@/hooks/useLeaderboard';

export default function LiveLeaderboard() {
  const { sessionLogs } = useQuizStore();
  const { empId } = useAuth();
  const { socket } = useSocket(empId);
  const { leaderboard, fetchLeaderboard } = useLeaderboard(socket);

  useEffect(() => {
    // Polling fallback
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <div className="w-full h-full flex flex-col p-6 font-mono conic-border-box rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,60,0.2)]">
      <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-6 text-[#ff003c] border-b border-[#ff003c]/30 pb-4">
        Global Rank
      </h2>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-6">
        {leaderboard.map((player) => {
          const isUser = player.empId === empId;
          return (
            <div 
              key={player.empId}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isUser 
                  ? 'bg-[#ff003c]/10 border-[#ff003c] shadow-[0_0_15px_rgba(255,0,60,0.4)]'
                  : 'bg-black/30 border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl font-black ${isUser ? 'text-[#ff003c]' : 'text-gray-500'}`}>
                  #{player.rank}
                </span>
                <span className={`font-bold uppercase tracking-wider ${isUser ? 'text-white' : 'text-gray-300'}`}>
                  {player.name}
                </span>
                {isUser && <ShieldAlert className="w-4 h-4 text-[#ff003c]" />}
              </div>
              <span className={`font-black ${isUser ? 'text-[#ff003c]' : 'text-gray-400'}`}>
                {player.xp} XP
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-[200px] overflow-y-auto custom-scrollbar pr-2 space-y-3 border-t border-[#ff003c]/30 pt-4">
        <h3 className="text-sm text-[#ff003c] uppercase tracking-widest mb-2 font-bold">Activity Log</h3>
        {sessionLogs.length === 0 ? (
          <p className="text-gray-600 text-sm italic">Awaiting input...</p>
        ) : (
          sessionLogs.map((log, index) => (
            <div key={index} className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">#{index + 1}</span>
                <span className="text-gray-300 text-xs truncate max-w-[120px]">{log.questionId}</span>
              </div>
              <div>
                {log.isCorrect ? (
                  <Check className="w-4 h-4 text-[#00ff88]" />
                ) : (
                  <X className="w-4 h-4 text-[#ff003c]" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
