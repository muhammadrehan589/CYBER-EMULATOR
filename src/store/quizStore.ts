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
  timer: number;
  sessionLogs: SessionLog[];
  incrementScore: (amount?: number) => void;
  advanceQuestion: () => void;
  addLog: (log: SessionLog) => void;
  setTimer: (time: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      currentQuestionIndex: 0,
      score: 0,
      timer: 0,
      sessionLogs: [],
      incrementScore: (amount = 1) => set((state) => ({ score: state.score + amount })),
      advanceQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
      addLog: (log) => set((state) => ({ sessionLogs: [...state.sessionLogs, log] })),
      setTimer: (time) => set({ timer: time }),
      resetQuiz: () => set({ currentQuestionIndex: 0, score: 0, timer: 0, sessionLogs: [] }),
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        currentQuestionIndex: state.currentQuestionIndex,
        score: state.score,
      }),
    }
  )
);
