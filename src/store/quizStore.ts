import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import quizData from '@/data/questions.json';

const questions = quizData.questions;

interface SessionLog {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizState {
  currentQuestionIndex: number;
  score: number;
  streak: number;
  multiplier: number;
  playedQuestions: number[];
  timer: number;
  sessionLogs: SessionLog[];
  advanceQuestion: (isCorrect: boolean, basePoints: number) => void;
  addLog: (log: SessionLog) => void;
  setTimer: (time: number) => void;
  resetQuiz: () => void;
}

const DIFFICULTY_TIERS = ['easy', 'medium', 'hard', 'expert'];

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      currentQuestionIndex: 0,
      score: 0,
      streak: 0,
      multiplier: 1,
      playedQuestions: [],
      timer: 0,
      sessionLogs: [],
      advanceQuestion: (isCorrect: boolean, basePoints: number) => set((state) => {
        let newStreak = state.streak;
        let newMultiplier = state.multiplier;
        let newScore = state.score;

        if (isCorrect) {
          newStreak += 1;
          if (newStreak >= 6) newMultiplier = 3;
          else if (newStreak >= 3) newMultiplier = 2;
          else newMultiplier = 1;
          
          newScore += basePoints * newMultiplier;
        } else {
          newStreak = 0;
          newMultiplier = 1;
        }

        const newPlayed = [...state.playedQuestions, state.currentQuestionIndex];
        
        // Determine Next Difficulty
        const currentQuestion = questions[state.currentQuestionIndex];
        let currentTierStr = currentQuestion?.difficulty?.toLowerCase() || 'easy';
        if (currentTierStr === 'difficult') currentTierStr = 'hard';

        let currentTierIndex = DIFFICULTY_TIERS.indexOf(currentTierStr);
        if (currentTierIndex === -1) currentTierIndex = 0;

        let targetTierIndex = currentTierIndex;
        if (isCorrect) {
          targetTierIndex = Math.min(DIFFICULTY_TIERS.length - 1, currentTierIndex + 1);
        } else {
          targetTierIndex = Math.max(0, currentTierIndex - 1);
        }

        let targetDifficulty = DIFFICULTY_TIERS[targetTierIndex];
        
        // Find next question
        let nextIndex = -1;
        
        // Try to find an unplayed question of the target difficulty
        const availableOfTarget = questions.findIndex((q: any, idx: number) => {
           let diff = q.difficulty?.toLowerCase() || 'easy';
           if (diff === 'difficult') diff = 'hard';
           return diff === targetDifficulty && !newPlayed.includes(idx);
        });

        if (availableOfTarget !== -1) {
           nextIndex = availableOfTarget;
        } else {
           // Fallback to any unplayed question
           nextIndex = questions.findIndex((_, idx: number) => !newPlayed.includes(idx));
        }

        // If no unplayed questions remain, fallback to sequential
        if (nextIndex === -1) {
           nextIndex = state.currentQuestionIndex + 1;
        }

        return {
          score: newScore,
          streak: newStreak,
          multiplier: newMultiplier,
          currentQuestionIndex: nextIndex,
          playedQuestions: newPlayed
        };
      }),
      addLog: (log) => set((state) => ({ sessionLogs: [...state.sessionLogs, log] })),
      setTimer: (time) => set({ timer: time }),
      resetQuiz: () => set({ 
        currentQuestionIndex: 0, 
        score: 0, 
        streak: 0,
        multiplier: 1,
        playedQuestions: [],
        timer: 0, 
        sessionLogs: [] 
      }),
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        currentQuestionIndex: state.currentQuestionIndex,
        score: state.score,
        streak: state.streak,
        multiplier: state.multiplier,
        playedQuestions: state.playedQuestions
      }),
    }
  )
);
