'use client';
import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { LeaderboardPlayer } from '@/types/dashboard';
import { BADGE_COLORS } from '@/components/dashboard/LeaderboardItem';
import { DEFAULT_AVATAR } from '@/components/Avatar';

export function useLeaderboard(socket: Socket | null) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        // Filter out suspended players, forced renames, and ADMINS from public view
        const activeUsers = json.data.filter((u: any) => u.status !== 'suspended' && u.forceUsernameChange !== true && u.role !== 'Admin');
        const sorted = activeUsers.sort(
          (a: any, b: any) => (b.xp - a.xp) || (b.coins - a.coins)
        );
        const mapped: LeaderboardPlayer[] = sorted.map((u: any, idx: number) => ({
          rank: idx + 1,
          empId: u.empId,
          name: u.name,
          username: u.username,
          role: u.role,
          score: u.score || 0,
          xp: u.xp || 0,
          coins: u.coins || 0,
          badgeColor: BADGE_COLORS[idx % BADGE_COLORS.length],
          avatar:
            u.activeAvatar && Object.keys(u.activeAvatar).length > 0
              ? { ...DEFAULT_AVATAR, ...u.activeAvatar }
              : DEFAULT_AVATAR,
        }));
        setLeaderboard(mapped);
      }
    } catch (error) {
      console.error('[useLeaderboard] Failed to fetch:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Real-time refresh via socket
  useEffect(() => {
    if (!socket) return;
    socket.on('refresh_leaderboard', fetchLeaderboard);
    
    socket.on('update_score', (data: { empId: string; newScore: number }) => {
      setLeaderboard((prevLeaderboard) => {
        const updated = prevLeaderboard.map((p) =>
          p.empId === data.empId ? { ...p, xp: data.newScore } : p
        );
        updated.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        return updated.map((p, idx) => ({ ...p, rank: idx + 1 }));
      });
    });

    return () => {
      socket.off('refresh_leaderboard', fetchLeaderboard);
      socket.off('update_score');
    };
  }, [socket, fetchLeaderboard]);

  return { leaderboard, setLeaderboard, fetchLeaderboard };
}
