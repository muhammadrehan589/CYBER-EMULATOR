'use client';

import React from 'react';
import Link from 'next/link';
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
  ChevronRight
} from 'lucide-react';

export default function PlayerDashboard() {
  return (
    <div className="min-h-screen bg-[#020005] text-white p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden flex flex-col justify-between">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#e60039]/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto space-y-8 relative z-10">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#ff0055]/30">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
              title="Sign Out to Login"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white">
                CYBER<span className="text-[#ff0055]">//</span>SIMULATOR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 flex items-center gap-2.5 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
              <UserCheck className="w-4 h-4 text-[#ff0055]" />
              <div className="flex flex-col font-mono text-xs">
                <span className="font-bold text-white">PLAYER #456</span>
                <span className="text-[10px] text-[#ff0055]">STATUS: ACTIVE</span>
              </div>
            </div>
            {/* Prominent CREATE AVATAR Button */}
            <Link
              href="/avatar"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Create Avatar
            </Link>
          </div>
        </header>

        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0a030d]/90 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0055]/20 border border-[#ff0055]/40 text-xs font-mono text-[#ff0055]">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              PLAYER WORKSTATION ACTIVE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
              Welcome to the Arena
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
              Your neural link is synchronized. Complete active challenges, customize your operant avatar, and advance through the cyber grid.
            </p>
          </div>

          {/* Large CTA Box */}
          <div className="z-10 shrink-0">
            <Link
              href="/avatar"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white font-bold text-sm tracking-wider uppercase flex items-center gap-3 shadow-[0_0_30px_#ff0055] hover:scale-105 transition-all border border-white/30"
            >
              <Sparkles className="w-5 h-5" />
              CUSTOMIZE AVATAR STUDIO
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">TOTAL SCORE</span>
              <span className="text-2xl font-extrabold text-[#ff0055] font-mono">4,560 PTS</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1c061e] border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055]">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">GLOBAL RANK</span>
              <span className="text-2xl font-extrabold text-white font-mono">#456</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1c061e] border border-[#ff0055]/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">SIM ACCURACY</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">94.2%</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">SURVIVED ROUNDS</span>
              <span className="text-2xl font-extrabold text-white font-mono">4 / 6</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1c061e] border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Play className="w-4 h-4 text-[#ff0055]" />
              ACTIVE SIMULATION CHALLENGES
            </h2>
            <span className="text-xs font-mono text-zinc-400">SEASON 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">● COMPLETED</span>
                <span className="text-zinc-500">+1200 PTS</span>
              </div>
              <h3 className="text-base font-bold text-white">Glass Bridge Simulation</h3>
              <p className="text-xs text-zinc-400">
                Memorized tempered glass stepping tiles in Sector 4.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a030d]/80 border-2 border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.3)] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#ff0055] font-bold animate-pulse">● IN PROGRESS</span>
                <span className="text-zinc-400">+1500 PTS</span>
              </div>
              <h3 className="text-base font-bold text-white">Tug of War Strategy</h3>
              <p className="text-xs text-zinc-400">
                Synchronize timing pulses with team members to pull opponent weight.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a030d]/80 border border-zinc-800 space-y-3 opacity-75">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 font-bold">○ LOCKED</span>
                <span className="text-zinc-500">ROUND 5</span>
              </div>
              <h3 className="text-base font-bold text-zinc-300">Dalgona Precision</h3>
              <p className="text-xs text-zinc-500">
                Carve geometric shapes out of sugar honeycomb without breaking borders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-zinc-500 border-t border-zinc-900 pt-6 mt-8 relative z-10">
        Cyber Simulator Player Arena &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
