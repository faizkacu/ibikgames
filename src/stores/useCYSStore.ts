import { create } from 'zustand';

interface CYSState {
  isRevealed: boolean;
  reveal: () => void;
  resetReveal: () => void;
  reset: () => void;
}

export const useCYSStore = create<CYSState>((set) => ({
  isRevealed: false,
  reveal: () => set({ isRevealed: true }),
  resetReveal: () => set({ isRevealed: false }),
  reset: () => set({ isRevealed: false }),
}));
