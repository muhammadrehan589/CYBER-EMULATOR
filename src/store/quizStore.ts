import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionLog {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  highestStreak: number;
  multiplier: number;
  playedQuestions: number[];
  timer: number;
  sessionLogs: SessionLog[];
  coinsEarned: number;
  xpEarned: number;
  inventory: { 
    hints: number; 
    timeFreezes: number; 
    shields: number; 
    sabotagers: number;
    decoys: number;
    ddosEmps: number;
    overclocks: number;
    autoSorters: number;
    screenFreezes: number;
  };
  advanceQuestion: (isCorrect: boolean, basePoints: number) => void;
  resetStreak: () => void;
  addLog: (log: SessionLog) => void;
  setTimer: (time: number) => void;
  resetQuiz: () => void;
  buyItem: (item: 'hints' | 'timeFreezes' | 'shields' | 'sabotagers' | 'decoys' | 'ddosEmps' | 'overclocks' | 'autoSorters' | 'screenFreezes', cost: number) => boolean;
  executeSabotage: (targetPlayerId: string, socket: any) => void;
  consumeDecoy: () => void;
  consumeItem: (item: keyof QuizState['inventory']) => void;
  deductXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
}

const DIFFICULTY_TIERS = ['easy', 'medium', 'hard', 'expert'];

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      highestStreak: 0,
      multiplier: 1,
      playedQuestions: [],
      timer: 0,
      sessionLogs: [],
      coinsEarned: 0,
      xpEarned: 0,
      inventory: { hints: 0, timeFreezes: 0, shields: 0, sabotagers: 0, decoys: 0, ddosEmps: 0, overclocks: 0, autoSorters: 0, screenFreezes: 0 },
      advanceQuestion: (isCorrect: boolean, basePoints: number) => set((state) => {
        let newStreak = state.streak;
        let newHighestStreak = state.highestStreak;
        let newMultiplier = state.multiplier;
        let newScore = state.score;

        if (isCorrect) {
          newStreak += 1;
          if (newStreak > newHighestStreak) newHighestStreak = newStreak;
          
          if (newStreak >= 6) newMultiplier = 3;
          else if (newStreak >= 3) newMultiplier = 2;
          else newMultiplier = 1;
          
          newScore += basePoints * newMultiplier;
        } else {
          newStreak = 0;
          newMultiplier = 1;
        }

        const newPlayed = [...state.playedQuestions, state.currentQuestionIndex];
        const nextIndex = state.currentQuestionIndex + 1;

        return {
          score: newScore,
          streak: newStreak,
          highestStreak: newHighestStreak,
          multiplier: newMultiplier,
          currentQuestionIndex: nextIndex,
          playedQuestions: newPlayed
        };
      }),
      resetStreak: () => set({ streak: 0, multiplier: 1 }),
      addLog: (log) => set((state) => ({ sessionLogs: [...state.sessionLogs, log] })),
      setTimer: (time) => set({ timer: time }),
      resetQuiz: () => set({ 
        currentQuestionIndex: 0, 
        score: 0, 
        streak: 0,
        highestStreak: 0,
        multiplier: 1,
        playedQuestions: [],
        timer: 0, 
        sessionLogs: [],
        coinsEarned: 0,
        xpEarned: 0
      }),
      buyItem: (item, cost) => {
        const state = get();
        if (state.coinsEarned >= cost) {
          set({
            coinsEarned: state.coinsEarned - cost,
            inventory: {
              ...state.inventory,
              [item]: state.inventory[item] + 1
            }
          });
          return true;
        }
        return false;
      },
      executeSabotage: (targetPlayerId, socket) => {
        const state = get();
        if (state.inventory.sabotagers > 0) {
          set({
            inventory: {
              ...state.inventory,
              sabotagers: state.inventory.sabotagers - 1
            }
          });
          if (socket) {
            socket.emit('player_sabotage', { targetId: targetPlayerId, penaltyXp: 150 });
          }
        }
      },
      consumeItem: (item) => {
          set(state => ({
            inventory: {
              ...state.inventory,
              [item]: Math.max(0, state.inventory[item] - 1)
            }
          }));
        },
        consumeDecoy: () => {
        set(state => ({
          inventory: {
            ...state.inventory,
            decoys: Math.max(0, state.inventory.decoys - 1)
          }
        }));
      },
      deductXP: (amount) => {
        set(state => ({
          xpEarned: Math.max(0, state.xpEarned - amount)
        }));
      },
      addCoins: (amount) => {
        set(state => ({ coinsEarned: state.coinsEarned + amount }));
      },
      addXP: (amount) => {
        set(state => ({ xpEarned: state.xpEarned + amount }));
      }
    }),
    {
      name: 'quiz-storage',
      // currentQuestionIndex is intentionally NOT persisted.
      // QuizEngine owns its own local soloQuestionIndex bounded to the
      // 10-item session array; persisting the store's index was the root
      // cause of the "1-question then back to Dashboard" bug.
      partialize: (state) => ({
        score: state.score,
        streak: state.streak,
        multiplier: state.multiplier,
        playedQuestions: state.playedQuestions,
        coinsEarned: state.coinsEarned,
        xpEarned: state.xpEarned,
        inventory: state.inventory
      }),
    }
  )
);


