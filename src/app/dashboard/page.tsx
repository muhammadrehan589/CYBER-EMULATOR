'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  Play, 
  Zap, 
  Sparkles, 
  Circle, 
  Triangle, 
  Square, 
  Wifi, 
  WifiOff,
  PlusCircle,
  Flame
} from 'lucide-react';

interface LeaderboardPlayer {
  rank: number;
  empId: string;
  name: string;
  username: string;
  role: string;
  score: number;
  badgeColor: string;
}

interface FloatingEmoji {
  id: string;
  empId: string;
  emoji: string;
}

const INITIAL_PLAYERS: LeaderboardPlayer[] = [
  { rank: 1, empId: 'EMP-001', name: 'Abdurrehman', username: 'abdurrehman', role: 'Admin', score: 9999, badgeColor: '#ff0055' },
  { rank: 2, empId: 'EMP-007', name: 'Oh Il-nam', username: 'ilnam007', role: 'VIP', score: 9000, badgeColor: '#f59e0b' },
  { rank: 3, empId: 'EMP-456', name: 'Seong Gi-hun', username: 'gihun456', role: 'Player', score: 4560, badgeColor: '#10b981' },
  { rank: 4, empId: 'EMP-067', name: 'Kang Sae-byeok', username: 'saebyeok067', role: 'VIP', score: 4100, badgeColor: '#a855f7' },
  { rank: 5, empId: 'EMP-218', name: 'Cho Sang-woo', username: 'sangwoo218', role: 'Player', score: 3820, badgeColor: '#3b82f6' },
];

export default function Phase3RealtimeDashboard() {
  // Socket.io instance reference
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Dynamic Leaderboard State Array
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>(INITIAL_PLAYERS);

  // Floating Emoji Animations State Array
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Reaction Emoji Counter Totals
  const [reactionCounts, setReactionCounts] = useState<{ [key: string]: number }>({
    '🔥': 154,
    '⚡': 112,
    '💀': 89,
    '👑': 240,
    '🎯': 96,
  });

  // Establish Socket.io connection on component mount
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[FRONTEND] Connected to Socket server:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[FRONTEND] Disconnected from Socket server');
      setIsConnected(false);
    });

    // Listen for live broadcast of update_score
    newSocket.on('update_score', (data: { empId: string; newScore: number }) => {
      console.log('[FRONTEND] Received update_score event:', data);
      setLeaderboard((prevLeaderboard) => {
        const updated = prevLeaderboard.map((p) =>
          p.empId === data.empId ? { ...p, score: data.newScore } : p
        );

        // Dynamically re-sort from highest score to lowest score
        updated.sort((a, b) => b.score - a.score);

        // Reassign rank index
        return updated.map((p, idx) => ({ ...p, rank: idx + 1 }));
      });
    });

    // Listen for live broadcast of send_emoji
    newSocket.on('send_emoji', (data: { empId: string; emoji: string; id: string }) => {
      console.log('[FRONTEND] Received send_emoji event:', data);
      const emojiId = data.id || `${Date.now()}-${Math.random()}`;

      // Trigger floating emoji animation
      setFloatingEmojis((prev) => [...prev, { id: emojiId, empId: data.empId, emoji: data.emoji }]);

      // Increment reaction totals
      setReactionCounts((prev) => ({
        ...prev,
        [data.emoji]: (prev[data.emoji] || 0) + 1,
      }));

      // Remove floating emoji after animation completes (1.8s)
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiId));
      }, 1800);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Helper to emit score boost
  const handleScoreBoost = (empId: string, currentScore: number) => {
    const newScore = currentScore + 250;

    // Update local state immediately
    setLeaderboard((prevLeaderboard) => {
      const updated = prevLeaderboard.map((p) =>
        p.empId === empId ? { ...p, score: newScore } : p
      );
      updated.sort((a, b) => b.score - a.score);
      return updated.map((p, idx) => ({ ...p, rank: idx + 1 }));
    });

    // Emit to Socket server if connected
    if (socket && isConnected) {
      socket.emit('update_score', { empId, newScore });
    }
  };

  // Helper to emit emoji reaction
  const handleEmitEmoji = (empId: string, emoji: string) => {
    const emojiObj = { empId, emoji, id: `emoji-${Date.now()}-${Math.random()}` };

    // Trigger local floating animation if socket not connected
    if (!socket || !isConnected) {
      setFloatingEmojis((prev) => [...prev, emojiObj]);
      setReactionCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiObj.id));
      }, 1800);
    } else {
      socket.emit('send_emoji', emojiObj);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* Ambient Crimson/Fuchsia Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto space-y-6 relative z-10 my-auto">
        
        {/* Navigation Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#ff0055]/30">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
              title="Sign Out to Login"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055] shadow-[0_0_15px_#ff0055]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  CYBER<span className="text-[#ff0055]">//</span>SIMULATOR
                </span>
                <div className="flex items-center gap-1 text-[#ff0055] px-2 py-0.5 rounded-full bg-[#1c061e] border border-[#ff0055]/30">
                  <Circle className="w-2.5 h-2.5 fill-current" />
                  <Triangle className="w-2.5 h-2.5 fill-current" />
                  <Square className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Socket Connection Status & EDIT AVATAR */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 font-mono text-xs text-[#ff0055]">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">SOCKET LIVE (PORT 3001)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">SOCKET SYNC READY</span>
                </>
              )}
            </div>

            {/* Glowing EDIT AVATAR Button */}
            <Link
              href="/avatar"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              EDIT AVATAR
            </Link>
          </div>
        </header>

        {/* 70 / 30 SPLIT CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          
          {/* LEFT PANEL (70% WIDTH -> lg:col-span-7): Arena Card & Score Boosters */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Massive Arena Card */}
            <div className="squid-panel rounded-3xl p-6 sm:p-8 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] relative overflow-hidden space-y-6">
              
              {/* Status Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff0055]/20 border border-[#ff0055]/40 text-xs font-mono text-[#ff0055]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping" />
                  <span>PHASE 3 // REAL-TIME MULTIPLAYER LEADERBOARD</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">SECTOR 04</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                  Live Synchronized Arena
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                  Real-time Socket.io pipeline active. Score updates and emoji reaction streams are broadcast instantly across all connected operants.
                </p>
              </div>

              {/* Action Button & Arena Info */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-10 py-5 rounded-2xl bg-[#0a0a0a] border border-red-500 hover:shadow-[0_0_40px_rgba(255,0,60,0.6)] hover:bg-[#ff003c] text-[#ff003c] hover:text-white font-mono font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(255,0,60,0.5)] transition-all active:scale-95 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-pulse group-hover:bg-white" />
                  ENTER SIMULATION MATRIX
                </button>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 px-4 py-2 rounded-xl bg-[#050008] border border-zinc-800">
                  <div>LATENCY: <span className="text-emerald-400 font-bold">12 MS</span></div>
                  <div>BROADCAST: <span className="text-[#ff0055] font-bold">SOCKET.IO</span></div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">TOP SCORE</span>
                <span className="text-xl font-extrabold text-[#ff0055] font-mono">
                  {leaderboard[0]?.score.toLocaleString()} PTS
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">LEADER</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {leaderboard[0]?.name}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">OPERANTS</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">5 ACTIVE</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">REACTIONS</span>
                <span className="text-xl font-extrabold text-white font-mono">LIVE STREAM</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (30% WIDTH -> lg:col-span-3): Live Leaderboard & Real-Time Floating Emoji Reactions */}
          <div className="lg:col-span-3 squid-panel rounded-3xl p-6 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] space-y-5">
            
            {/* Leaderboard Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#ff0055]" />
                <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  LIVE LEADERBOARD
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055] animate-pulse">
                REAL-TIME
              </span>
            </div>

            {/* DYNAMIC REAL-TIME SORTED LEADERBOARD LIST */}
            <div className="space-y-3 relative min-h-[300px]">
              {leaderboard.map((player) => {
                // Find floating emojis targeting this specific player row
                const rowEmojis = floatingEmojis.filter((e) => e.empId === player.empId);

                return (
                  <div
                    key={player.empId}
                    className={`p-3 rounded-xl border relative flex items-center justify-between transition-all duration-500 ${
                      player.rank === 1
                        ? 'bg-[#1e0720] border-[#ff0055] shadow-[0_0_18px_rgba(255,0,85,0.35)]'
                        : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/40'
                    }`}
                  >
                    {/* FLOATING EMOJI ANIMATION OVER TARGET PLAYER ROW */}
                    <AnimatePresence>
                      {rowEmojis.map((e) => (
                        <motion.div
                          key={e.id}
                          initial={{ y: 0, opacity: 1, scale: 1 }}
                          animate={{ y: -50, opacity: 0, scale: 1.5 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.6, ease: 'easeOut' }}
                          className="absolute right-12 top-1 text-2xl z-50 pointer-events-none drop-shadow-[0_0_10px_#ff0055]"
                        >
                          {e.emoji}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Player Identity & Rank */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: player.badgeColor }}
                      >
                        #{player.rank}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white leading-tight">
                          {player.name}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">
                          @{player.username}
                        </span>
                      </div>
                    </div>

                    {/* Score & Quick Boost Action */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {player.score.toLocaleString()}
                      </span>

                      {/* Emoji trigger per player */}
                      <button
                        onClick={() => handleEmitEmoji(player.empId, '🔥')}
                        className="p-1 rounded bg-[#1c061e] border border-[#ff0055]/30 text-xs hover:bg-[#ff0055] transition-colors cursor-pointer"
                        title={`Send 🔥 reaction to ${player.name}`}
                      >
                        🔥
                      </button>

                      {/* Score Boost per player */}
                      <button
                        onClick={() => handleScoreBoost(player.empId, player.score)}
                        className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-[9px] font-mono text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                        title={`Boost ${player.name} +250 PTS`}
                      >
                        +250
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Global Emoji Reaction Feed Buttons */}
            <div className="pt-3 border-t border-[#ff0055]/20 space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                BROADCAST EMOJI REACTION TO LEADERBOARD:
              </span>
              <div className="flex items-center justify-between gap-1.5">
                {Object.entries(reactionCounts).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmitEmoji(leaderboard[0]?.empId || 'EMP-001', emoji)}
                    className="flex-1 py-2 rounded-xl bg-[#050008] border border-zinc-800 hover:border-[#ff0055] text-xs font-mono flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 cursor-pointer shadow-sm"
                  >
                    <span>{emoji}</span>
                    <span className="text-[9px] text-zinc-400 font-bold">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
