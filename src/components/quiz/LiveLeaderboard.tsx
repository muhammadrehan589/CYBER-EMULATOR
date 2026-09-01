'use client';

import React, { useState, useEffect } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { Check, X, ShieldAlert } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface LeaderboardPlayer {
  empId: string;
  name: string;
  score: number;
  xp: number;
  isUser: boolean;
  rank: number;
}

export default function LiveLeaderboard() {
  const { sessionLogs } = useQuizStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const currentEmpId = localStorage.getItem('currentUserEmpId') || 'EMP-456';
        const sorted = json.data.sort((a: any, b: any) => (b.xp - a.xp) || (b.coins - a.coins));
        const mapped: LeaderboardPlayer[] = sorted.map((u: any, index: number) => ({
          empId: u.empId,
          name: u.empId === currentEmpId ? 'YOU' : u.name,
          score: u.score,
          xp: u.xp || 0,
          isUser: u.empId === currentEmpId,
          rank: index + 1
        }));
        setLeaderboard(mapped);
      }
    } catch (error) {
      console.error('[LiveLeaderboard] Failed to fetch:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('refresh_leaderboard', () => {
      fetchLeaderboard();
    });

    newSocket.on('update_score', (data: { empId: string; newScore: number }) => {
      fetchLeaderboard(); // fetch to get latest xp and score
    });

    // Also poll every 3 seconds just in case we miss socket events for xp updates
    const intervalId = setInterval(fetchLeaderboard, 3000);

    return () => {
      newSocket.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-6 font-mono conic-border-box rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,0,60,0.2)]">
      <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-6 text-[#ff003c] border-b border-[#ff003c]/30 pb-4">
        Global Rank
      </h2>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-6">
        {leaderboard.map((player) => {
          const isUser = player.isUser;
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
