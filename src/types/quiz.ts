import type { GameType, SideType } from './database';

export interface QuizFormData {
  nama_quiz: string;
  tipe_game: GameType;
  questions: QuestionFormData[];
}

export interface QuestionFormData {
  id?: string;
  teks_soal: string;
  pilihan_kiri: string;
  pilihan_kanan: string;
  sisi_benar: SideType;
  urutan: number;
}

export interface QuizWithQuestions {
  id: string;
  nama_quiz: string;
  tipe_game: GameType;
  kode_sesi: string;
  kode_sesi_tim_b: string | null;
  is_active: boolean;
  created_at: string;
  questions: {
    id: string;
    teks_soal: string;
    pilihan_kiri: string | null;
    pilihan_kanan: string | null;
    sisi_benar: SideType | null;
    jawaban_benar: string | null;
    urutan: number;
  }[];
}
