'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CYSCreatorView } from '@/components/choose-your-side/CYSCreatorView';
import { CTBCreatorView } from '@/components/clear-the-box/CTBCreatorView';
import { Loading } from '@/components/ui/Loading';
import type { GameType } from '@/types/database';

export default function CreatorPlayPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [quizId, setQuizId] = useState<string>('');
  const [tipeGame, setTipeGame] = useState<GameType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadSession = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Anda harus login sebagai Creator.');
        setLoading(false);
        return;
      }

      // Verify this session belongs to the creator's quiz
      const { data: session } = await supabase
        .from('sessions')
        .select('id, quiz_id, quizzes!inner(creator_id, tipe_game)')
        .eq('id', sessionId)
        .eq('quizzes.creator_id', user.id)
        .maybeSingle();

      if (!session) {
        setError('Sesi tidak ditemukan atau bukan milik Anda.');
        setLoading(false);
        return;
      }

      setQuizId(session.quiz_id);
      setTipeGame((session.quizzes as unknown as { tipe_game: GameType }).tipe_game);
      setLoading(false);
    };

    loadSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  if (tipeGame === 'clear_the_box') {
    return <CTBCreatorView sessionId={sessionId} quizId={quizId} />;
  }

  return <CYSCreatorView sessionId={sessionId} quizId={quizId} />;
}
