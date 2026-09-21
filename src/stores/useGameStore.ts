import { create } from 'zustand';
import type { Question } from '@/types/database';

interface GameState {
  sessionId: string | null;
  quizId: string | null;
  questions: Question[];
  currentIndex: number;
  totalQuestions: number;
  setSession: (sessionId: string, quizId: string) => void;
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  sessionId: null,
  quizId: null,
  questions: [],
  currentIndex: 0,
  totalQuestions: 0,
  setSession: (sessionId, quizId) => set({ sessionId, quizId }),
  setQuestions: (questions) =>
    set({ questions, totalQuestions: questions.length }),
  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.totalQuestions - 1),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),
  reset: () =>
    set({
      sessionId: null,
      quizId: null,
      questions: [],
      currentIndex: 0,
      totalQuestions: 0,
    }),
}));
