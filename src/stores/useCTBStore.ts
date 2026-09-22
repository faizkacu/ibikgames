import { create } from 'zustand';
import type { Question } from '@/types/database';

export type BoxStatus = 'normal' | 'cleared' | 'wrong';

export interface BoxData {
  id: string;
  urutan: number;
  status: BoxStatus;
  question: Question;
}

interface CTBState {
  boxes: BoxData[];
  modalOpen: boolean;
  activeBoxId: string | null;
  setBoxes: (boxes: BoxData[]) => void;
  openModal: (boxId: string) => void;
  closeModal: () => void;
  setBoxCleared: (boxId: string) => void;
  setBoxWrong: (boxId: string) => void;
  resetBoxStatus: (boxId: string) => void;
  reset: () => void;
}

export const useCTBStore = create<CTBState>((set) => ({
  boxes: [],
  modalOpen: false,
  activeBoxId: null,
  setBoxes: (boxes) => set({ boxes }),
  openModal: (boxId) => set({ modalOpen: true, activeBoxId: boxId }),
  closeModal: () => set({ modalOpen: false, activeBoxId: null }),
  setBoxCleared: (boxId) =>
    set((state) => ({
      boxes: state.boxes.map((box) =>
        box.id === boxId ? { ...box, status: 'cleared' } : box
      ),
    })),
  setBoxWrong: (boxId) =>
    set((state) => ({
      boxes: state.boxes.map((box) =>
        box.id === boxId ? { ...box, status: 'wrong' } : box
      ),
    })),
  resetBoxStatus: (boxId) =>
    set((state) => ({
      boxes: state.boxes.map((box) =>
        box.id === boxId ? { ...box, status: 'normal' } : box
      ),
    })),
  reset: () => set({ boxes: [], modalOpen: false, activeBoxId: null }),
}));
