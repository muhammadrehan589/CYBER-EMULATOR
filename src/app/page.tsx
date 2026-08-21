'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { 
  Gamepad2, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Circle, 
  Triangle, 
  Square, 
  Wifi, 
  WifiOff,
  List
} from 'lucide-react';
import { MiniAvatar, AvatarSVG, DEFAULT_AVATAR, type AvatarState } from '@/components/Avatar';

interface LeaderboardPlayer {
  rank: number;
  empId: string;
  name: string;
  username: string;
  role: string;
  score: number;
  xp: number;
  badgeColor: string;
  avatar: AvatarState;
}

interface FloatingEmoji {
  id: string;
  empId: string;
  emoji: string;
  senderName?: string;
}

const BADGE_COLORS = ['#ff0055', '#f59e0b', '#10b981', '#a855f7', '#3b82f6', '#14b8a6', '#ef4444'];

const RANK_BADGE_STYLES: Record<number, string> = {
  1: 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-[0_0_12px_rgba(251,191,36,0.6)]',
  2: 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-black shadow-[0_0_8px_rgba(200,200,200,0.4)]',
  3: 'bg-gradient-to-br from-amber-700 to-amber-800 text-white shadow-[0_0_8px_rgba(180,100,40,0.4)]',
};

const LeaderboardItem = ({ 
  player, 
  floatingEmojis, 
  onEmitEmoji, 
  onScoreBoost,
  mini = true
}: { 
  player: LeaderboardPlayer; 
  floatingEmojis: FloatingEmoji[]; 
  onEmitEmoji: (id: string, emoji: string) => void;
  onScoreBoost: (id: string) => void;
  mini?: boolean;
}) => {
  const rowEmojis = floatingEmojis.filter((e) => e.empId === player.empId);
  const badgeStyle = RANK_BADGE_STYLES[player.rank] || '';

  return (
    <div
      className={`px-3 py-2.5 rounded-xl border relative flex items-center gap-3 transition-all duration-500 ${
        player.rank === 1
          ? 'bg-[#1e0720] border-[#ff0055] shadow-[0_0_18px_rgba(255,0,85,0.25)]'
          : 'bg-[#050008] border-zinc-800/80 hover:border-[#ff0055]/30'
      }`}
    >
      <AnimatePresence>
        {rowEmojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -50, opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute right-8 top-0 flex items-center gap-1.5 z-50 pointer-events-none drop-shadow-[0_0_10px_#ff0055]"
          >
            <span className="text-2xl">{e.emoji}</span>
            {e.senderName && (
              <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded border border-[#ff0055]/50 whitespace-nowrap">
                Boosted by {e.senderName}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Rank Badge */}
      <div
        className={`w-8 h-8 rounded-lg font-mono text-xs font-black flex items-center justify-center shrink-0 ${
          badgeStyle || 'text-white'
        }`}
        style={!badgeStyle ? { backgroundColor: player.badgeColor } : undefined}
      >
        #{player.rank}
      </div>

      {/* Avatar */}
      <div className={`${
        mini ? 'w-10 h-10 rounded-full' : 'w-[48px] h-[76px] rounded-xl'
      } overflow-hidden bg-black/60 border border-white/10 shrink-0 flex items-center justify-center`}>
        {mini ? (
          <MiniAvatar avatar={player.avatar} />
        ) : (
          <AvatarSVG avatar={player.avatar} size={48} mini={false} />
        )}
      </div>

      {/* Name + Username */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-bold text-white leading-tight truncate">
          {player.name}
        </span>
        <span className="text-[10px] font-mono text-zinc-500 truncate">
          @{player.username}
        </span>
      </div>

      {/* Score + Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex flex-col items-end">
          <span className="text-sm font-mono font-bold text-white tabular-nums">
            {player.score.toLocaleString()} PTS
          </span>
          <span className="text-[10px] font-mono text-[#ff0055] font-black">
            {player.xp} XP
          </span>
        </div>
        <button
          onClick={() => onEmitEmoji(player.empId, '🔥')}
          className="p-1 rounded bg-[#1c061e] border border-[#ff0055]/30 text-xs hover:bg-[#ff0055] hover:border-[#ff0055] transition-all cursor-pointer ml-2"
          title={`Send 🔥 to ${player.name}`}
        >
          🔥
        </button>
        <button
          onClick={() => onScoreBoost(player.empId)}
          className="px-1.5 py-1 rounded bg-emerald-950 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer whitespace-nowrap"
          title={`Boost ${player.name} +250 XP`}
        >
          +250 XP
        </button>
      </div>
    </div>
  );
};

const FullLeaderboardModal = ({
  isOpen,
  onClose,
  leaderboard,
  floatingEmojis,
  onEmitEmoji,
  onScoreBoost
}: {
  isOpen: boolean;
  onClose: () => void;
  leaderboard: LeaderboardPlayer[];
  floatingEmojis: FloatingEmoji[];
  onEmitEmoji: (id: string, emoji: string) => void;
  onScoreBoost: (id: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[82vh] bg-[#0a030d] border border-[#ff0055]/40 rounded-3xl p-6 flex flex-col shadow-[0_0_50px_rgba(255,0,85,0.2)]">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#ff0055]/30">
          <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ff0055]" />
            FULL LEADERBOARD
            <span className="text-xs font-mono text-zinc-400 font-normal">({leaderboard.length} operants)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1e0720] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ff0055 #1e0720' }}>
          {leaderboard.map((player) => (
            <LeaderboardItem 
              key={player.empId}
              player={player}
              floatingEmojis={floatingEmojis}
              onEmitEmoji={onEmitEmoji}
              onScoreBoost={onScoreBoost}
              mini={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Phase3RealtimeDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [reactionCounts, setReactionCounts] = useState<{ [key: string]: number }>({
    '🔥': 0,
    '⚡': 0,
    '💀': 0,
    '👑': 0,
    '🎯': 0,
  });
  
  const [isFullLeaderboardOpen, setIsFullLeaderboardOpen] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const sorted = json.data.sort((a: any, b: any) => (b.score - a.score) || (b.xp - a.xp));
        const mapped: LeaderboardPlayer[] = sorted.map((u: any, idx: number) => ({
          rank: idx + 1,
          empId: u.empId,
          name: u.name,
          username: u.username,
          role: u.role,
          score: u.score,
          xp: u.xp || 0,
          badgeColor: BADGE_COLORS[idx % BADGE_COLORS.length],
          avatar: (u.activeAvatar && Object.keys(u.activeAvatar).length > 0)
            ? { ...DEFAULT_AVATAR, ...u.activeAvatar }
            : DEFAULT_AVATAR,
        }));
        setLeaderboard(mapped);
      }
    } catch (error) {
      console.error('[Dashboard] Failed to fetch leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

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

    newSocket.on('refresh_leaderboard', () => {
      console.log('[FRONTEND] Refreshing leaderboard from socket event');
      fetchLeaderboard();
    });

    newSocket.on('update_score', (data: { empId: string; newScore: number }) => {
      setLeaderboard((prevLeaderboard) => {
        const updated = prevLeaderboard.map((p) =>
          p.empId === data.empId ? { ...p, score: data.newScore } : p
        );
        updated.sort((a, b) => b.score - a.score);
        return updated.map((p, idx) => ({ ...p, rank: idx + 1 }));
      });
    });

    newSocket.on('send_emoji', (data: { empId: string; emoji: string; id: string; senderName?: string }) => {
      const emojiId = data.id || `${Date.now()}-${Math.random()}`;
      setFloatingEmojis((prev) => [...prev, { id: emojiId, empId: data.empId, emoji: data.emoji, senderName: data.senderName }]);
      setReactionCounts((prev) => ({
        ...prev,
        [data.emoji]: (prev[data.emoji] || 0) + 1,
      }));
      setTimeout(() => {
        setFloatingEmojis((prev) => prev.filter((e) => e.id !== emojiId));
      }, 1800);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleScoreBoost = async (empId: string) => {
    const currentEmpId = localStorage.getItem('currentUserEmpId');
    if (!currentEmpId || currentEmpId === empId) return; // Cannot boost yourself

    const sender = leaderboard.find(p => p.empId === currentEmpId);
    if (!sender || sender.xp < 250) {
      alert("Not enough XP to boost!");
      return;
    }

    try {
      await Promise.all([
        fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empId: currentEmpId, inc: { xp: -250 } }),
        }),
        fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empId, inc: { xp: 250 } }),
        })
      ]);

      if (socket && isConnected) {
        socket.emit('trigger_refresh'); // Refresh all leaderboards globally
      } else {
        fetchLeaderboard();
      }

      fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId,
          action: 'XP Boost',
          type: 'xp',
          details: `XP boosted by +250 from ${sender.name}.`,
        }),
      }).catch((err) => console.error('[Dashboard] Log persist failed:', err));
    } catch (err) {
      console.error('[Dashboard] XP transfer failed:', err);
    }
  };

  const handleEmitEmoji = (empId: string, emoji: string) => {
    const currentEmpId = localStorage.getItem('currentUserEmpId');
    const sender = leaderboard.find(p => p.empId === currentEmpId);
    const senderName = sender ? sender.name : 'Unknown';

    const emojiObj = { empId, emoji, id: `emoji-${Date.now()}-${Math.random()}`, senderName };
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

  const top5Leaderboard = leaderboard.slice(0, 5);

  return (
    <div className="min-h-screen h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden flex flex-col justify-between select-none">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto space-y-6 relative z-10 my-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#ff0055]/30">
          <div className="flex items-center gap-3">
            <Link
              href="/login"
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

            <Link
              href="/avatar"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              EDIT AVATAR
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            <div className="squid-panel rounded-3xl p-6 sm:p-8 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff0055]/20 border border-[#ff0055]/40 text-xs font-mono text-[#ff0055]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping" />
                  <span>PHASE 3 // REAL-TIME MULTIPLAYER LEADERBOARD</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">SECTOR 04</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                  Live Synchronized Arena
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                  Real-time Socket.io pipeline active. Score updates and emoji reaction streams are broadcast instantly across all connected operants.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button 
                  onClick={() => window.location.href = '/simulation-matrix'}
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
                <span className="text-xl font-extrabold text-emerald-400 font-mono">{leaderboard.length} ACTIVE</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md flex flex-col justify-between space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">REACTIONS</span>
                <span className="text-xl font-extrabold text-white font-mono">LIVE STREAM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-3 squid-panel rounded-3xl p-6 border border-[#ff0055]/40 backdrop-blur-xl shadow-[0_0_35px_rgba(255,0,85,0.25)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#ff0055]" />
                <h3 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  LIVE LEADERBOARD (TOP 5)
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055] animate-pulse">
                REAL-TIME
              </span>
            </div>

            <div className="space-y-2 relative min-h-[280px]">
              {top5Leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-zinc-600 font-mono text-xs text-center gap-2">
                  <Trophy className="w-8 h-8 opacity-30" />
                  <p>No players yet. Sign up to claim the #1 spot!</p>
                </div>
              ) : (
                top5Leaderboard.map((player) => (
                  <LeaderboardItem
                    key={player.empId}
                    player={player}
                    floatingEmojis={floatingEmojis}
                    onEmitEmoji={handleEmitEmoji}
                    onScoreBoost={handleScoreBoost}
                  />
                ))
              )}
            </div>
            
            <button
              onClick={() => setIsFullLeaderboardOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 hover:border-[#ff0055]/50 hover:bg-[#1a0515] transition-all text-xs font-bold font-mono tracking-widest text-zinc-300 hover:text-[#ff0055] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <List className="w-4 h-4" />
              FULL PLAYER LEADERBOARD
            </button>

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
      
      <FullLeaderboardModal 
        isOpen={isFullLeaderboardOpen} 
        onClose={() => setIsFullLeaderboardOpen(false)} 
        leaderboard={leaderboard} 
        floatingEmojis={floatingEmojis}
        onEmitEmoji={handleEmitEmoji}
        onScoreBoost={handleScoreBoost}
      />
    </div>
  );
}
