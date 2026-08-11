'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, ArrowLeft, Trophy, ShieldCheck, Play, Zap } from 'lucide-react';

export default function PlayerDashboard() {
  return (
    <div className="min-h-screen bg-[#020005] text-white p-6 lg:p-12 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-[#ff0055]/30 relative z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-[#ff0055]" />
            <span className="font-extrabold text-xl tracking-wider text-white">
              CYBER<span className="text-[#ff0055]">//</span>SIMULATOR
            </span>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055]">
          PLAYER PORTAL v1.0
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto my-auto py-12 relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a061c] border border-[#ff0055]/40 text-xs font-mono text-[#ff0055]">
            <Zap className="w-3.5 h-3.5" />
            GAME SESSION READY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
            Player Arena Workstation
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Welcome to the Cyber Simulator arena. Your player profile is active and synced to the central grid.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,85,0.2)] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1c061e] border border-[#ff0055]/50 flex items-center justify-center text-[#ff0055]">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Launch Arena Simulator</h3>
            <p className="text-xs text-zinc-400">
              Initiate Round 1 of the obstacle grid and log your scores on the global leaderboard.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] font-bold text-xs uppercase tracking-wider text-white shadow-[0_0_15px_#ff0055] hover:opacity-90 transition-all">
              Start Round 1
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_30px_rgba(255,0,85,0.2)] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1c061e] border border-[#ff0055]/50 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Player Leaderboard</h3>
            <p className="text-xs text-zinc-400">
              View live standings, aggregate scores, and achievements across all active participants.
            </p>
            <button className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-700 font-bold text-xs uppercase tracking-wider text-zinc-300 hover:border-[#ff0055] hover:text-[#ff0055] transition-all">
              View Standings
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-500 border-t border-zinc-900 pt-6 relative z-10">
        Cyber Simulator &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
