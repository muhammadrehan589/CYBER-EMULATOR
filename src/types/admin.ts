export type PlayerRole = 'Admin' | 'Player' | 'VIP' | 'Guard';
export type PlayerStatus = 'active' | 'suspended';

export interface Player {
  empId: string;
  name: string;
  department: string;
  username: string;
  role: PlayerRole;
  status: PlayerStatus;
  score: number;
  xp?: number;
  coins?: number;
  joinedAt: string;
  warningMessage?: string;
  banUntil?: string;
  forceUsernameChange?: boolean;
}

export interface ActivityLogEntry {
  id: string;
  empId: string;
  timestamp: string;
  action: string;
  type: 'login' | 'score' | 'flag' | 'status_change';
  details: string;
}
