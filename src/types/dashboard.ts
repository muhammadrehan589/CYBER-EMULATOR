import type { AvatarState } from '@/types/avatar';

export interface LeaderboardPlayer {
  rank: number;
  empId: string;
  name: string;
  username: string;
  role: string;
  score: number;
  xp: number;
  coins: number;
  badgeColor: string;
  avatar: AvatarState;
  warningMessage?: string;
  hasSeenTour?: boolean;
}

export interface FloatingEmoji {
  id: string;
  empId: string;
  emoji: string;
  senderName?: string;
}

export interface FloatingStat {
  id: string;
  empId: string;
  type: 'xp_up' | 'xp_down' | 'coins_up' | 'coins_down';
  amount: number;
}
