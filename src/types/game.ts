// Game-specific types per mode
// Phase 1: Choose Your Side only

export interface CYSCreatorState {
  currentIndex: number;
  isRevealed: boolean;
  totalQuestions: number;
}

export interface CYSPesertaState {
  currentIndex: number;
  isRevealed: boolean;
  sisiBenar: 'kiri' | 'kanan' | null;
  gameEnded: boolean;
}
