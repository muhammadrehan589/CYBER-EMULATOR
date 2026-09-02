export const DIFFICULTY_TIME_LIMITS: Record<string, number> = {
  easy: 30,
  medium: 45,
  hard: 60,
  difficult: 60,
  expert: 60,
};

export const DIFFICULTY_XP_REWARDS: Record<string, number> = {
  easy: 20,
  medium: 50,
  hard: 100,
  difficult: 100,
  expert: 150,
};

export const DIFFICULTY_COIN_REWARDS: Record<string, number> = {
  easy: 10,
  medium: 20,
  hard: 50,
  difficult: 50,
  expert: 80,
};

export const DIFFICULTY_TIERS = ['easy', 'medium', 'hard', 'difficult', 'expert'] as const;
export type Difficulty = typeof DIFFICULTY_TIERS[number];
