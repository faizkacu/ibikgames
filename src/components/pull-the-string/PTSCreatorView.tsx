'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SessionCode } from '@/components/game/SessionCode';
import { PTSTugOfWar } from './PTSTugOfWar';
import { StopCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants/messages';

interface PTSCreatorViewProps {
  sessionId: string;
  quizId: string;
}

export function PTSCreatorView({ sessionId, quizId }: PTSCreatorViewProps) {
  const router = useRouter();
  const [namaQuiz, setNamaQuiz] = useState('');
  const [kodeSesi, setKodeSesi] = useState('');
  const [kodeSesiTimB, setKodeSesiTimB] = useState('');
  const [totalSoal, setTotalSoal] = useState(0);
  const [skorTimA, setSkorTimA] = useState(0);
  const [skorTimB, setSkorTimB] = useState(0);
  const [pesertaTimA, setPesertaTimA] = useState(0);
  const [pesertaTimB, setPesertaTimB] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [winner, setWinner] = useState<'tim_a' | 'tim_b' | null>(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>['channel']
  > | null>(null);

  const loadSessionData = useCallback(async () => {
    const supabase = createClient();

    // Load quiz info
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('nama_quiz, kode_sesi, kode_sesi_tim_b')
      .eq('id', quizId)
      .single();

    if (quiz) {
      setNamaQuiz(quiz.nama_quiz);
      setKodeSesi(quiz.kode_sesi);
      setKodeSesiTimB(quiz.kode_sesi_tim_b ?? '');
    }

    // Load questions count
    const { count } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('quiz_id', quizId);

    setTotalSoal(count ?? 0);

    // Load participants count per team
    const { data: participants } = await supabase
      .from('participants')
      .select('tim')
      .eq('session_id', sessionId);

    if (participants) {
      setPesertaTimA(participants.filter((p) => p.tim === 'tim_a').length);
      setPesertaTimB(participants.filter((p) => p.tim === 'tim_b').length);
    }

    setLoading(false);
  }, [quizId, sessionId]);

  useEffect(() => {
    loadSessionData();

    const supabase = createClient();

    // Subscribe to broadcast events
    const channel = supabase
      .channel(`game:${sessionId}`)
      .on(
        'broadcast',
        { event: 'team_progress' },
        (payload: { payload: { team: string; score: number } }) => {
          const { team, score } = payload.payload;
          if (team === 'tim_a') {
            setSkorTimA(score);
          } else if (team === 'tim_b') {
            setSkorTimB(score);
          }
        }
      )
      .on(
        'broadcast',
        { event: 'game_ended' },
        (payload: { payload: { winner: string; score_a: number; score_b: number } }) => {
          const { winner: w, score_a, score_b } = payload.payload;
          setSkorTimA(score_a);
          setSkorTimB(score_b);
          setIsFinished(true);
          setWinner(w as 'tim_a' | 'tim_b');
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, loadSessionData]);

  const handleEndSession = async () => {
    setEnding(true);
    const supabase = createClient();

    try {
      // Determine winner
      let timPemenang: 'tim_a' | 'tim_b' = 'tim_a';
      if (skorTimB > skorTimA) {
        timPemenang = 'tim_b';
      }

      // Save match result
      const { error: resultError } = await supabase
        .from('match_results')
        .insert({
          session_id: sessionId,
          skor_tim_a: skorTimA,
          skor_tim_b: skorTimB,
          tim_pemenang: timPemenang,
        });

      if (resultError) {
        // If duplicate (already saved), ignore
        if (resultError.code !== '23505') {
          toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
          setEnding(false);
          return;
        }
      }

      // End session
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ waktu_selesai: new Date().toISOString() })
        .eq('id', sessionId);

      if (sessionError) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        setEnding(false);
        return;
      }

      // Deactivate quiz
      await supabase
        .from('quizzes')
        .update({ is_active: false })
        .eq('id', quizId);

      // Broadcast game ended
      const channel = channelRef.current;
      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'game_ended',
          payload: {
            winner: timPemenang,
            score_a: skorTimA,
            score_b: skorTimB,
          },
        });
      }

      setIsFinished(true);
      setWinner(timPemenang);
      toast.success(SUCCESS_MESSAGES.SESI_BERAKHIR);
    } catch {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted">Memuat sesi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" size="md">
          Pull The String
        </Badge>
        <Badge variant="default" size="md">
          Tampilan Creator
        </Badge>
      </div>

      {/* Quiz Info */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary">{namaQuiz}</h2>

          {/* Dual Session Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted mb-1">Kode Sesi Tim A</p>
              <SessionCode code={kodeSesi} />
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Kode Sesi Tim B</p>
              <SessionCode code={kodeSesiTimB} />
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Tim A: {pesertaTimA} peserta</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Tim B: {pesertaTimB} peserta</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tug of War */}
      <Card>
        <PTSTugOfWar
          skorTimA={skorTimA}
          skorTimB={skorTimB}
          totalSoal={totalSoal}
          timPemenang={winner}
        />
      </Card>

      {/* Result */}
      {isFinished && winner && (
        <Card>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-primary">
              Pertandingan Selesai
            </p>
            <p className="text-2xl font-bold text-correct">
              {winner === 'tim_a' ? 'Tim A' : 'Tim B'} Menang
            </p>
            <p className="text-muted">
              Skor: {skorTimA} - {skorTimB}
            </p>
          </div>
        </Card>
      )}

      {/* End Session Button */}
      {!isFinished && (
        <div className="flex justify-center">
          <Button
            variant="danger"
            icon={StopCircle}
            onClick={handleEndSession}
            loading={ending}
          >
            {ending ? 'Mengakhiri...' : 'Akhiri Sesi'}
          </Button>
        </div>
      )}

      {/* Info */}
      <div className="text-center">
        <p className="text-xs text-muted">
          Tim pertama yang menyelesaikan {totalSoal} soal akan menang.
          Progres disimpan secara real-time.
        </p>
      </div>
    </div>
  );
}
