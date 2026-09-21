'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CYSCreatorView } from '@/components/choose-your-side/CYSCreatorView';
import { CYSPesertaView } from '@/components/choose-your-side/CYSPesertaView';
import { Loading } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';

interface PlayState {
  role: 'creator' | 'peserta';
  quizId: string;
  nama: string;
  loading: boolean;
}

export default function PlayPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [state, setState] = useState<PlayState>({
    role: 'peserta',
    quizId: '',
    nama: '',
    loading: true,
  });

  useEffect(() => {
    const loadSession = async () => {
      const supabase = createClient();

      // Check if creator
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Try to get session as creator
        const { data: session } = await supabase
          .from('sessions')
          .select('id, quiz_id, quizzes!inner(creator_id)')
          .eq('id', sessionId)
          .eq('quizzes.creator_id', user.id)
          .maybeSingle();

        if (session) {
          setState({
            role: 'creator',
            quizId: session.quiz_id,
            nama: user.user_metadata?.nama ?? 'Creator',
            loading: false,
          });
          return;
        }
      }

      // Check localStorage for participant
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('participant');
        if (stored) {
          const participant = JSON.parse(stored) as {
            kodeSesi: string;
            nama: string;
            sessionId: string;
          };
          if (participant.sessionId === sessionId) {
            const { data: session } = await supabase
              .from('sessions')
              .select('quiz_id')
              .eq('id', sessionId)
              .single();

            setState({
              role: 'peserta',
              quizId: session?.quiz_id ?? '',
              nama: participant.nama,
              loading: false,
            });
            return;
          }
        }
      }

      setState((prev) => ({ ...prev, loading: false }));
    };

    loadSession();
  }, [sessionId]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  if (!state.quizId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Sesi tidak ditemukan.</p>
      </div>
    );
  }

  if (state.role === 'creator') {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="text-xl font-bold text-primary">IBIKGAMES</span>
          <Badge variant="outline" size="md">
            Tampilan Creator
          </Badge>
        </div>
        <div className="p-6 md:p-8">
          <CYSCreatorView sessionId={sessionId} quizId={state.quizId} />
        </div>
      </div>
    );
  }

  return (
    <CYSPesertaView
      sessionId={sessionId}
      quizId={state.quizId}
      nama={state.nama}
    />
  );
}
