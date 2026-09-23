'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  PLACEHOLDER_MESSAGES,
} from '@/lib/constants/messages';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { GameType, TeamType } from '@/types/database';

export function JoinForm() {
  const [kodeSesi, setKodeSesi] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    kode_sesi?: string;
    nama?: string;
  }>({});
  const [tipeGame, setTipeGame] = useState<GameType | null>(null);
  const [selectedTim, setSelectedTim] = useState<TeamType | null>(null);
  const [detectedTeam, setDetectedTeam] = useState<TeamType | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [kodeChecked, setKodeChecked] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!kodeSesi.trim()) newErrors.kode_sesi = ERROR_MESSAGES.FIELD_WAJIB;
    else if (kodeSesi.trim().length !== 6)
      newErrors.kode_sesi = 'Kode sesi harus 6 digit.';
    if (!nama.trim()) newErrors.nama = ERROR_MESSAGES.FIELD_WAJIB;
    if (tipeGame === 'pull_the_string' && !selectedTim) {
      toast.error('Pilih tim terlebih dahulu.');
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKodeBlur = async () => {
    const kode = kodeSesi.trim();
    if (kode.length !== 6) {
      setTipeGame(null);
      setDetectedTeam(null);
      setKodeChecked(false);
      return;
    }

    const supabase = createClient();

    // Check if kode matches kode_sesi (Tim A or non-PTS)
    const { data: quizByKode } = await supabase
      .from('quizzes')
      .select('id, tipe_game, kode_sesi, kode_sesi_tim_b')
      .eq('kode_sesi', kode)
      .maybeSingle();

    if (quizByKode) {
      setQuizId(quizByKode.id);
      setTipeGame(quizByKode.tipe_game as GameType);
      if (quizByKode.tipe_game === 'pull_the_string') {
        setDetectedTeam('tim_a');
        setSelectedTim('tim_a');
      }
      setKodeChecked(true);
      return;
    }

    // Check if kode matches kode_sesi_tim_b (Tim B)
    const { data: quizByKodeB } = await supabase
      .from('quizzes')
      .select('id, tipe_game, kode_sesi, kode_sesi_tim_b')
      .eq('kode_sesi_tim_b', kode)
      .maybeSingle();

    if (quizByKodeB) {
      setQuizId(quizByKodeB.id);
      setTipeGame(quizByKodeB.tipe_game as GameType);
      if (quizByKodeB.tipe_game === 'pull_the_string') {
        setDetectedTeam('tim_b');
        setSelectedTim('tim_b');
      }
      setKodeChecked(true);
      return;
    }

    // Not found - don't show error on blur, let submit handle it
    setTipeGame(null);
    setDetectedTeam(null);
    setQuizId(null);
    setKodeChecked(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Find quiz by session code (check both kode_sesi and kode_sesi_tim_b)
      let quiz: { id: string; tipe_game: string; nama_quiz: string } | null = null;

      if (quizId) {
        const { data } = await supabase
          .from('quizzes')
          .select('id, tipe_game, nama_quiz')
          .eq('id', quizId)
          .single();
        quiz = data;
      } else {
        const { data } = await supabase
          .from('quizzes')
          .select('id, tipe_game, nama_quiz')
          .eq('kode_sesi', kodeSesi.trim())
          .single();
        quiz = data;

        if (!quiz) {
          const { data: quizB } = await supabase
            .from('quizzes')
            .select('id, tipe_game, nama_quiz')
            .eq('kode_sesi_tim_b', kodeSesi.trim())
            .single();
          quiz = quizB;
        }
      }

      if (!quiz) {
        toast.error(ERROR_MESSAGES.KODE_SESI_TIDAK_DITEMUKAN);
        return;
      }

      // 2. Find active session for this quiz
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('id')
        .eq('quiz_id', quiz.id)
        .is('waktu_selesai', null)
        .order('waktu_mulai', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError || !session) {
        toast.error(ERROR_MESSAGES.SESI_TELAH_BERAKHIR);
        return;
      }

      // 3. Check if name is already taken in this session
      const { data: existingParticipant } = await supabase
        .from('participants')
        .select('id, tim')
        .eq('session_id', session.id)
        .eq('nama', nama.trim())
        .maybeSingle();

      if (existingParticipant) {
        // Already joined - restore state
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'participant',
            JSON.stringify({
              kodeSesi: kodeSesi.trim(),
              nama: nama.trim(),
              sessionId: session.id,
              tim: (existingParticipant.tim as TeamType) ?? selectedTim,
            })
          );
        }
        if (quiz.tipe_game === 'pull_the_string') {
          router.push(`/team/${session.id}`);
        } else {
          router.push(`/game/${session.id}`);
        }
        return;
      }

      // 4. Insert participant
      const insertData: { session_id: string; nama: string; tim?: TeamType } = {
        session_id: session.id,
        nama: nama.trim(),
      };
      if (quiz.tipe_game === 'pull_the_string' && selectedTim) {
        insertData.tim = selectedTim;
      }

      const { error: insertError } = await supabase
        .from('participants')
        .insert(insertData);

      if (insertError) {
        if (insertError.code === '23505') {
          toast.error(ERROR_MESSAGES.NAMA_SUDAH_DIGUNAKAN);
        } else {
          toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        }
        return;
      }

      // 5. Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'participant',
          JSON.stringify({
            kodeSesi: kodeSesi.trim(),
            nama: nama.trim(),
            sessionId: session.id,
            tim: selectedTim,
          })
        );
      }

      toast.success(SUCCESS_MESSAGES.BERHASIL_JOIN);
      if (quiz.tipe_game === 'pull_the_string') {
        router.push(`/team/${session.id}`);
      } else {
        router.push(`/game/${session.id}`);
      }
    } catch {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Kode Sesi"
        placeholder={PLACEHOLDER_MESSAGES.KODE_SESI}
        value={kodeSesi}
        onChange={(e) => {
          setKodeSesi(e.target.value.replace(/\D/g, '').slice(0, 6));
          setKodeChecked(false);
          setTipeGame(null);
          setDetectedTeam(null);
        }}
        onBlur={handleKodeBlur}
        error={errors.kode_sesi}
        maxLength={6}
        required
      />

      {/* Team selector for PTS */}
      {kodeChecked && tipeGame === 'pull_the_string' && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-primary">
            Tim
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedTim('tim_a')}
              className={cn(
                'flex-1 py-2 px-4 rounded-[12px] text-sm font-medium border transition-colors duration-200 cursor-pointer',
                selectedTim === 'tim_a'
                  ? 'bg-primary text-secondary border-primary'
                  : 'bg-secondary text-primary border-border hover:border-primary'
              )}
            >
              Tim A
            </button>
            <button
              type="button"
              onClick={() => setSelectedTim('tim_b')}
              className={cn(
                'flex-1 py-2 px-4 rounded-[12px] text-sm font-medium border transition-colors duration-200 cursor-pointer',
                selectedTim === 'tim_b'
                  ? 'bg-primary text-secondary border-primary'
                  : 'bg-secondary text-primary border-border hover:border-primary'
              )}
            >
              Tim B
            </button>
          </div>
          {detectedTeam && (
            <p className="text-xs text-muted">
              Kode sesi ini untuk {detectedTeam === 'tim_a' ? 'Tim A' : 'Tim B'}.
            </p>
          )}
        </div>
      )}

      <Input
        label="Nama Kamu"
        placeholder={PLACEHOLDER_MESSAGES.NAMA_PESERTA}
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        error={errors.nama}
        required
      />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={loading}
        icon={LogIn}
      >
        {loading ? LOADING_MESSAGES.JOIN : 'Gabung'}
      </Button>
    </form>
  );
}
