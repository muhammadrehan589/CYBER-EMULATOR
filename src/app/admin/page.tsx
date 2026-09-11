'use client';

import React, { useState, useEffect } from 'react';
import { Player, ActivityLogEntry } from '@/types/admin';
import { PlayerTable } from '@/components/admin/PlayerTable';
import { ActivityLog } from '@/components/admin/ActivityLog';
import { PlayerManagementModal } from '@/components/admin/PlayerManagementModal';
import { UserModerationModal } from '@/components/admin/UserModerationModal';
import { 
  ShieldCheck, 
  Users, 
  UserX, 
  AlertTriangle, 
  Trophy, 
  ArrowLeft,
  Circle,
  Triangle,
  Square,
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';

// Initial Mock Player State with 'Abdurrehman' as Default Admin - NOW LOADED FROM API

const DEPARTMENTS = [
  'Security & Command',
  'Operations',
  'Engineering',
  'Intelligence',
  'Security',
  'VIP Lounge',
];

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { socket } = useSocket(null);


  const [modTarget, setModTarget] = useState<Player | null>(null);
  const [modAction, setModAction] = useState<'warning' | 'ban' | 'force_rename' | null>(null);

  const [resourceModTarget, setResourceModTarget] = useState<{player: Player, type: 'coins' | 'xp'} | null>(null);
  const [resourceAmount, setResourceAmount] = useState<number>(0);

  const handleModerateAction = async (payload: any) => {
    if (!modTarget) return;
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId: modTarget.empId, updates: payload }),
      });

      await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: modTarget.empId,
          action: `Moderation: ${modAction}`,
          type: 'status_change',
          details: `Admin applied ${modAction} to ${modTarget.username}`,
        }),
      });

      await fetchPlayers();
      await fetchLogs();

      try {
        const { io } = await import('socket.io-client');
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`;
        const tempSocket = io(socketUrl, { transports: ['websocket'] });
        tempSocket.emit('trigger_refresh');
        setTimeout(() => tempSocket.disconnect(), 1000);
      } catch (e) {}
    } catch (error) {
      console.error('[Admin] Moderation failed:', error);
    } finally {
      setModTarget(null);
      setModAction(null);
    }
  };

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceModTarget) return;

    try {
      const incPayload = { [resourceModTarget.type]: resourceAmount };
      
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId: resourceModTarget.player.empId, inc: incPayload }),
      });

      await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: resourceModTarget.player.empId,
          action: `Resource Update`,
          type: 'score',
          details: `Admin added ${resourceAmount} ${resourceModTarget.type.toUpperCase()} to ${resourceModTarget.player.username}`,
        }),
      });

      await fetchPlayers();
      await fetchLogs();

      try {
        const { io } = await import('socket.io-client');
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`;
        const tempSocket = io(socketUrl, { transports: ['websocket'] });
        tempSocket.emit('trigger_refresh');
        setTimeout(() => tempSocket.disconnect(), 1000);
      } catch (e) {}
    } catch (error) {
      console.error('[Admin] Edit resource failed:', error);
    } finally {
      setResourceModTarget(null);
      setResourceAmount(0);
    }
  };

  // Reusable fetch helpers
  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success) {
        const mapped: Player[] = json.data.map((u: any) => ({
          empId: u.empId,
          name: u.name,
          username: u.username,
          department: u.department,
          role: u.role,
          status: u.status,
          score: u.score,
          coins: u.coins || 0,
          xp: u.xp || 0,
          joinedAt: u.joinedAt ? new Date(u.joinedAt).toISOString().slice(0, 10) : '',
          warningMessage: u.warningMessage,
          banUntil: u.banUntil,
          forceUsernameChange: u.forceUsernameChange,
        }));
        setPlayers(mapped);
        return mapped;
      }
    } catch (error) {
      console.error('[Admin] Failed to fetch players:', error);
    }
    return [];
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/activity-logs');
      const json = await res.json();
      if (json.success) {
        const mapped: ActivityLogEntry[] = json.data.map((l: any) => ({
          id: l._id || l.id,
          empId: l.empId,
          timestamp: l.timestamp ? new Date(l.timestamp).toISOString().replace('T', ' ').slice(0, 16) : '',
          action: l.action,
          type: l.type,
          details: l.details,
        }));
        setLogs(mapped);
      }
    } catch (error) {
      console.error('[Admin] Failed to fetch logs:', error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const fetched = await fetchPlayers();
      await fetchLogs();
      if (fetched.length > 0) {
        setSelectedPlayer(fetched[0]);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('refresh_leaderboard', fetchPlayers);
    socket.on('update_score', fetchPlayers);
    
    return () => {
      socket.off('refresh_leaderboard', fetchPlayers);
      socket.off('update_score', fetchPlayers);
    };
  }, [socket]);

  // Filtered Players Logic
  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.empId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDepartment === 'ALL' || player.department === selectedDepartment;

    return matchesSearch && matchesDept;
  });

  // Toggle Suspend / Activate Player State
  const handleToggleStatus = async (empId: string) => {
    const player = players.find((p) => p.empId === empId);
    if (!player) return;

    const newStatus = player.status === 'active' ? 'suspended' : 'active';

    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empId, updates: { status: newStatus } }),
      });

      await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId,
          action: newStatus === 'suspended' ? 'Player Suspended' : 'Player Reactivated',
          type: 'status_change',
          details: `Status set to ${newStatus.toUpperCase()} by Admin Abdurrehman.`,
        }),
      });

      await fetchPlayers();
      await fetchLogs();

      try {
        const { io } = await import('socket.io-client');
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`;
        const tempSocket = io(socketUrl, { transports: ['websocket'] });
        tempSocket.emit('trigger_refresh');
        setTimeout(() => tempSocket.disconnect(), 1000);
      } catch (e) {}

      if (selectedPlayer?.empId === empId) {
        setSelectedPlayer((prev) => prev ? { ...prev, status: newStatus as Player['status'] } : null);
      }
    } catch (error) {
      console.error('[Admin] Toggle status failed:', error);
    }
  };

  // Add New Player Handler
  const handleAddPlayer = async (newPlayerData: Omit<Player, 'status' | 'score' | 'joinedAt'> & { password?: string }) => {
    try {
      const { password, ...playerFields } = newPlayerData;
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...playerFields, password }),
      });

      await fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: newPlayerData.empId,
          action: 'Account Created',
          type: 'login',
          details: `New ${newPlayerData.role} registered in ${newPlayerData.department} by Admin Abdurrehman.`,
        }),
      });

      const updated = await fetchPlayers();
      await fetchLogs();

      const added = updated.find((p: Player) => p.empId === newPlayerData.empId);
      if (added) setSelectedPlayer(added);
    } catch (error) {
      console.error('[Admin] Add player failed:', error);
    }
  };

  // KPI Metrics Calculation
  const activeCount = players.filter((p) => p.status === 'active').length;
  const suspendedCount = players.filter((p) => p.status === 'suspended').length;
  const flagCount = logs.filter((l) => l.type === 'flag').length;
  const totalScore = players.reduce((sum, p) => sum + p.score, 0);

  return (
    <div className="min-h-screen bg-[#020005] text-white p-4 sm:p-6 lg:p-8 font-sans relative overflow-x-hidden">
      {/* Background Subtle Crimson Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#e60039]/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* Top Navigation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#ff0055]/25">
          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2.5 rounded-xl bg-[#0e0414] border border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055] hover:text-white transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
              title="Secure Logout"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#ff0055] tracking-widest uppercase">
                  ADMIN CONTROL ROOM // PHASE 1
                </span>
                <div className="flex items-center gap-1 text-[#ff0055] px-2 py-0.5 rounded-full bg-[#1c061e] border border-[#ff0055]/30">
                  <Circle className="w-2.5 h-2.5 fill-current" />
                  <Triangle className="w-2.5 h-2.5 fill-current" />
                  <Square className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                Squid Game Player Directory & Audit Log
              </h1>
            </div>
          </div>

          {/* Admin Logged-In Badge */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#120315] border border-[#ff0055]/40 flex items-center gap-2.5 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
              <ShieldCheck className="w-4 h-4 text-[#ff0055]" />
              <div className="flex flex-col text-right font-mono">
                <span className="text-xs font-bold text-white">Abdurrehman</span>
                <span className="text-[9px] text-[#ff0055]">SYSTEM ADMIN (EMP-001)</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff0055]"></div>
          </div>
        ) : (
        <>
        {/* KPI Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Personnel Card */}
          <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,85,0.1)] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">Active Personnel</span>
              <span className="text-2xl font-extrabold text-white font-mono">{activeCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Suspended Players Card */}
          <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,85,0.1)] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">Suspended Players</span>
              <span className="text-2xl font-extrabold text-red-500 font-mono">{suspendedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-500">
              <UserX className="w-5 h-5" />
            </div>
          </div>

          {/* Security Flags Card */}
          <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,85,0.1)] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">Security Flags</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">{flagCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* Total Aggregate Score Card */}
          <div className="p-4 rounded-2xl bg-[#0a030d]/80 border border-[#ff0055]/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,85,0.1)] flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-zinc-400 block uppercase">Total System Score</span>
              <span className="text-2xl font-extrabold text-[#ff0055] font-mono">{totalScore.toLocaleString()}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1f0622] border border-[#ff0055]/50 flex items-center justify-center text-[#ff0055]">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Content Layout: PlayerTable (Left/Wide) + ActivityLog (Right/Side Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Player Table Column (2/3 width) */}
          <div className="lg:col-span-2">
            <PlayerTable
              players={filteredPlayers}
              selectedPlayer={selectedPlayer}
              onSelectPlayer={setSelectedPlayer}
              onToggleStatus={handleToggleStatus}
              onModerateAction={(player, action) => {
                setModTarget(player);
                setModAction(action);
              }}
              onEditCoins={(player) => {
                setResourceModTarget({ player, type: 'coins' });
                setResourceAmount(0);
              }}
              onEditXP={(player) => {
                setResourceModTarget({ player, type: 'xp' });
                setResourceAmount(0);
              }}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              departments={DEPARTMENTS}
            />
          </div>

          {/* Activity Log Side Panel (1/3 width) */}
          <div className="lg:col-span-1">
            <ActivityLog selectedPlayer={selectedPlayer} logs={logs} />
          </div>
        </div>
        </>
        )}

        {/* Player Add Modal */}
        <PlayerManagementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddPlayer={handleAddPlayer}
          departments={DEPARTMENTS}
        />

        {modTarget && modAction && (
          <UserModerationModal
            user={modTarget}
            action={modAction}
            onClose={() => {
              setModTarget(null);
              setModAction(null);
            }}
            onConfirm={handleModerateAction}
          />
        )}

        {resourceModTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0a030d] border border-[#ff0055]/30 rounded-2xl shadow-[0_0_40px_rgba(255,0,85,0.2)] p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Modify {resourceModTarget.type.toUpperCase()} for {resourceModTarget.player.name}
              </h2>
              <form onSubmit={handleEditResource} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Amount to Add/Remove (use negative numbers to remove)
                  </label>
                  <input
                    type="number"
                    value={resourceAmount}
                    onChange={(e) => setResourceAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-[#120315] border border-[#ff0055]/30 rounded-lg text-white font-mono focus:outline-none focus:border-[#ff0055]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setResourceModTarget(null)}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ff0055] hover:bg-[#e60039] text-white rounded-lg text-sm font-bold shadow-[0_0_10px_#ff0055] transition-colors"
                  >
                    CONFIRM
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
