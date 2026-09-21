export type GameType =
  | 'choose_your_side'
  | 'clear_the_box'
  | 'pull_the_string';

export type SideType = 'kiri' | 'kanan';

export type TeamType = 'tim_a' | 'tim_b';

export interface User {
  id: string;
  nama: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  creator_id: string;
  nama_quiz: string;
  tipe_game: GameType;
  kode_sesi: string;
  kode_sesi_tim_b: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  teks_soal: string;
  pilihan_kiri: string | null;
  pilihan_kanan: string | null;
  sisi_benar: SideType | null;
  jawaban_benar: string | null;
  urutan: number;
}

export interface Session {
  id: string;
  quiz_id: string;
  waktu_mulai: string;
  waktu_selesai: string | null;
}

export interface Participant {
  id: string;
  session_id: string;
  nama: string;
  tim: TeamType | null;
  joined_at: string;
}

export interface Answer {
  id: string;
  participant_id: string;
  question_id: string;
  is_correct: boolean;
  answered_at: string;
}

export interface MatchResult {
  id: string;
  session_id: string;
  skor_tim_a: number;
  skor_tim_b: number;
  tim_pemenang: TeamType;
  waktu_selesai: string;
}
