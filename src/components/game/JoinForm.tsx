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

export function JoinForm() {
  const [kodeSesi, setKodeSesi] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    kode_sesi?: string;
    nama?: string;
  }>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!kodeSesi.trim()) newErrors.kode_sesi = ERROR_MESSAGES.FIELD_WAJIB;
    else if (kodeSesi.trim().length !== 6)
      newErrors.kode_sesi = 'Kode sesi harus 6 digit.';
    if (!nama.trim()) newErrors.nama = ERROR_MESSAGES.FIELD_WAJIB;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      // 1. Find quiz by session code
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('id, tipe_game, nama_quiz')
        .eq('kode_sesi', kodeSesi.trim())
        .single();

      if (quizError || !quiz) {
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
        .select('id')
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
            })
          );
        }
        router.push(`/play/${session.id}`);
        return;
      }

      // 4. Insert participant
      const { error: insertError } = await supabase
        .from('participants')
        .insert({
          session_id: session.id,
          nama: nama.trim(),
        });

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
          })
        );
      }

      toast.success(SUCCESS_MESSAGES.BERHASIL_JOIN);
      router.push(`/game/${session.id}`);
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
        onChange={(e) => setKodeSesi(e.target.value.replace(/\D/g, '').slice(0, 6))}
        error={errors.kode_sesi}
        maxLength={6}
        required
      />
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
