'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  ShieldCheck, 
  Play, 
  Zap, 
  UserCheck, 
  Sparkles, 
  Target, 
  Award,
  ChevronRight,
  Circle,
  Triangle,
  Square,
  Activity,
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

const TOP_LEADERBOARD_PLAYERS: LeaderboardPlayer[] = [
  { rank: 1, empId: 'EMP-001', name: 'Abdurrehman', username: 'abdurrehman', role: 'Admin', score: 9999, badgeColor: '#ff0055' },
  { rank: 2, empId: 'EMP-007', name: 'Oh Il-nam', username: 'ilnam007', role: 'VIP', score: 9000, badgeColor: '#f59e0b' },
  { rank: 3, empId: 'EMP-456', name: 'Seong Gi-hun', username: 'gihun456', role: 'Player', score: 4560, badgeColor: '#10b981' },
  { rank: 4, empId: 'EMP-067', name: 'Kang Sae-byeok', username: 'saebyeok067', role: 'VIP', score: 4100, badgeColor: '#a855f7' },
  { rank: 5, empId: 'EMP-218', name: 'Cho Sang-woo', username: 'sangwoo218', role: 'Player', score: 3820, badgeColor: '#3b82f6' },
];

export default function HighFidelityPlayerDashboard() {
  // Reaction Emoji Counters State
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    '🔥': 142,
    '⚡': 98,
    '💀': 67,
    '👑': 210,
    '🎯': 85,
  });

  const handleEmojiClick = (emoji: string) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: prev[emoji] + 1,
    }));
  };

  return (
    <div className="min-h-screen h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto space-y-6 relative z-10 my-auto">
        
        {/* Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#ff0055]/30">
          {/* Logo & Back Link */}
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

          {/* Right Action Bar: Status & EDIT AVATAR Button */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 font-mono text-xs text-[#ff0055]">
              <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
              <span>PLAYER #456: ONLINE</span>
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
          
          {/* LEFT PANEL (70% WIDTH -> lg:col-span-7): Massive SYSTEM STANDBY Arena Card & Stats */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Massive Arena Card */}
            <div className="squid-panel rounded-3xl p-6 sm:p-8 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] relative overflow-hidden space-y-6">
              
              {/* Status Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff0055]/20 border border-[#ff0055]/40 text-xs font-mono text-[#ff0055]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping" />
                  <span>ARENA SIMULATOR // STANDBY</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">SECTOR 04</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                  Round 1: Red Light Green Light Simulation
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                  Neural sensors calibrated. Motion tracking active for 456 participants. Maintain absolute stillness when the ocular camera rotates. Complete the course before timer expiration.
                </p>
              </div>

              {/* Action Button & Arena Info */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button 
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] hover:shadow-[0_0_30px_#ff0055] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg border border-white/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  START SIMULATION
                </button>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 px-4 py-2 rounded-xl bg-[#050008] border border-zinc-800">
                  <div>LIMIT: <span className="text-white font-bold">5 MIN</span></div>
                  <div>PASS: <span className="text-[#ff0055] font-bold">85%+</span></div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">SYSTEM SCORE</span>
                <span className="text-xl font-extrabold text-[#ff0055] font-mono">9,999 PTS</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">GLOBAL RANK</span>
                <span className="text-xl font-extrabold text-white font-mono">#1 (ADMIN)</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">ACCURACY</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">99.8%</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">SURVIVED</span>
                <span className="text-xl font-extrabold text-white font-mono">6 / 6</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (30% WIDTH -> lg:col-span-3): Vertical Leaderboard Panel & Mock Reactions */}
          <div className="lg:col-span-3 squid-panel rounded-3xl p-6 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] space-y-5">
            
            {/* Leaderboard Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#ff0055]" />
                <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  TOP OPERANTS
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055]">
                RANKED
              </span>
            </div>

            {/* Top 5 Mock Players List */}
            <div className="space-y-3">
              {TOP_LEADERBOARD_PLAYERS.map((player) => (
                <div
                  key={player.empId}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    player.rank === 1
                      ? 'bg-[#1e0720] border-[#ff0055] shadow-[0_0_15px_rgba(255,0,85,0.3)]'
                      : 'bg-[#050008] border-zinc-800 hover:border-[#ff0055]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className="w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center text-white"
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

                  {/* Score */}
                  <span className="text-xs font-mono font-bold text-white">
                    {player.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Mock Emoji Reaction Buttons */}
            <div className="pt-4 border-t border-[#ff0055]/20 space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                ARENA REACTION FEEDBACK:
              </span>
              <div className="flex items-center justify-between gap-1.5">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="flex-1 py-2 rounded-xl bg-[#050008] border border-zinc-800 hover:border-[#ff0055] text-xs font-mono flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 cursor-pointer"
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
