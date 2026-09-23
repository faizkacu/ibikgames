import { create } from 'zustand';

export type TeamSide = 'tim_a' | 'tim_b';

interface PTSState {
  teamScore: number;
  opponentScore: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  isFinished: boolean;
  winner: TeamSide | null;
  setTotalQuestions: (total: number) => void;
  setCurrentQuestion: (index: number) => void;
  incrementScore: () => void;
  updateOpponentScore: (score: number) => void;
  finishGame: (winner: TeamSide) => void;
  reset: () => void;
}

export const usePTSStore = create<PTSState>((set) => ({
  teamScore: 0,
  opponentScore: 0,
  totalQuestions: 0,
  currentQuestionIndex: 0,
  isFinished: false,
  winner: null,
  setTotalQuestions: (total) => set({ totalQuestions: total }),
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  incrementScore: () =>
    set((state) => ({ teamScore: state.teamScore + 1 })),
  updateOpponentScore: (score) => set({ opponentScore: score }),
  finishGame: (winner) => set({ isFinished: true, winner }),
  reset: () =>
    set({
      teamScore: 0,
      opponentScore: 0,
      totalQuestions: 0,
      currentQuestionIndex: 0,
      isFinished: false,
      winner: null,
    }),
}));
