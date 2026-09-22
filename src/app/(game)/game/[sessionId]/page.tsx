'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CYSPesertaView } from '@/components/choose-your-side/CYSPesertaView';
import { Loading } from '@/components/ui/Loading';

export default function PesertaGamePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [quizId, setQuizId] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadParticipant = async () => {
      // Read participant data from localStorage (no auth needed)
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem('participant');
      if (!stored) {
        setError('Data peserta tidak ditemukan. Silakan join ulang.');
        setLoading(false);
        return;
      }

      try {
        const participant = JSON.parse(stored) as {
          kodeSesi: string;
          nama: string;
          sessionId: string;
        };

        // Verify this matches the current session
        if (participant.sessionId !== sessionId) {
          setError('Sesi tidak sesuai. Silakan join ulang.');
          setLoading(false);
          return;
        }

        const supabase = createClient();

        // Get session and quiz info
        const { data: session } = await supabase
          .from('sessions')
          .select('quiz_id, waktu_selesai')
          .eq('id', sessionId)
          .single();

        if (!session) {
          setError('Sesi tidak ditemukan.');
          setLoading(false);
          return;
        }

        if (session.waktu_selesai) {
          setError('Sesi permainan telah berakhir.');
          setLoading(false);
          return;
        }

        setQuizId(session.quiz_id);
        setNama(participant.nama);
        setLoading(false);
      } catch {
        setError('Data peserta tidak valid.');
        setLoading(false);
      }
    };

    loadParticipant();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => router.push('/join')}
            className="text-primary underline underline-offset-4"
          >
            Kembali ke halaman join
          </button>
        </div>
      </div>
    );
  }

  return (
    <CYSPesertaView
      sessionId={sessionId}
      quizId={quizId}
      nama={nama}
    />
  );
}
