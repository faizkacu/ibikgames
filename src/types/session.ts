import type { Session, Participant, TeamType } from './database';

export interface SessionWithQuiz extends Session {
  quiz: {
    id: string;
    nama_quiz: string;
    tipe_game: string;
    kode_sesi: string;
  };
}

export interface ParticipantIdentifier {
  kodeSesi: string;
  nama: string;
  sessionId: string;
  tim?: TeamType | null;
}

export interface JoinValidationResult {
  valid: boolean;
  error?: string;
  session?: Session;
  quizId?: string;
  tipeGame?: string;
}
