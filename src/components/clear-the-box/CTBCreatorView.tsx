'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SessionCode } from '@/components/game/SessionCode';
import { StopCircle, Users, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants/messages';

interface ParticipantScore {
  id: string;
  nama: string;
  skor: number;
}

interface CTBCreatorViewProps {
  sessionId: string;
  quizId: string;
}

export function CTBCreatorView({ sessionId, quizId }: CTBCreatorViewProps) {
  const router = useRouter();
  const [namaQuiz, setNamaQuiz] = useState('');
  const [kodeSesi, setKodeSesi] = useState('');
  const [totalSoal, setTotalSoal] = useState(0);
  const [participants, setParticipants] = useState<ParticipantScore[]>([]);
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
      .select('nama_quiz, kode_sesi')
      .eq('id', quizId)
      .single();

    if (quiz) {
      setNamaQuiz(quiz.nama_quiz);
      setKodeSesi(quiz.kode_sesi);
    }

    // Load questions count
    const { count } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('quiz_id', quizId);

    setTotalSoal(count ?? 0);

    // Load participants with scores
    await loadParticipants();
    setLoading(false);
  }, [quizId]);

  const loadParticipants = useCallback(async () => {
    const supabase = createClient();

    const { data: participantData } = await supabase
      .from('participants')
      .select('id, nama')
      .eq('session_id', sessionId);

    if (!participantData || participantData.length === 0) {
      setParticipants([]);
      return;
    }

    // Get scores for each participant
    const participantIds = participantData.map((p) => p.id);
    const { data: answersData } = await supabase
      .from('answers')
      .select('participant_id')
      .in('participant_id', participantIds)
      .eq('is_correct', true);

    const scoreMap = new Map<string, number>();
    if (answersData) {
      for (const answer of answersData) {
        const current = scoreMap.get(answer.participant_id) ?? 0;
        scoreMap.set(answer.participant_id, current + 1);
      }
    }

    const scores: ParticipantScore[] = participantData.map((p) => ({
      id: p.id,
      nama: p.nama,
      skor: scoreMap.get(p.id) ?? 0,
    }));

    // Sort by score descending
    scores.sort((a, b) => b.skor - a.skor);
    setParticipants(scores);
  }, [sessionId]);

  useEffect(() => {
    loadSessionData();

    const supabase = createClient();

    // Subscribe to answers changes for real-time updates
    const channel = supabase
      .channel(`ctb-creator:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers',
        },
        () => {
          // Reload participants when a new answer is inserted
          loadParticipants();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, loadSessionData, loadParticipants]);

  const handleEndSession = async () => {
    setEnding(true);
    const supabase = createClient();

    try {
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ waktu_selesai: new Date().toISOString() })
        .eq('id', sessionId);

      if (sessionError) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      await supabase
        .from('quizzes')
        .update({ is_active: false })
        .eq('id', quizId);

      toast.success(SUCCESS_MESSAGES.SESI_BERAKHIR);
      router.push(`/games/${quizId}/statistics`);
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
          Clear The Box
        </Badge>
        <Badge variant="default" size="md">
          Tampilan Creator
        </Badge>
      </div>

      {/* Session Info */}
      <Card>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-primary">{namaQuiz}</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted mb-1">Kode Sesi</p>
              <SessionCode code={kodeSesi} />
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Jumlah Soal</p>
              <p className="text-2xl font-bold text-primary">{totalSoal}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted" />
            <p className="text-sm text-muted">
              {participants.length} peserta bergabung
            </p>
          </div>
        </div>
      </Card>

      {/* Participants Score */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">
          Skor Peserta
        </h2>
        {participants.length === 0 ? (
          <Card>
            <p className="text-muted text-center py-6">
              Belum ada peserta yang bergabung.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {participants.map((p, index) => (
              <Card key={p.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted bg-surface px-2 py-0.5 rounded-sm">
                      {index + 1}
                    </span>
                    <p className="font-medium text-primary">{p.nama}</p>
                    {index === 0 && p.skor > 0 && (
                      <Trophy className="w-4 h-4 text-correct" />
                    )}
                  </div>
                  <Badge variant={p.skor === totalSoal ? 'correct' : 'outline'} size="sm">
                    {p.skor}/{totalSoal} box cleared
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* End Session Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="danger"
          icon={StopCircle}
          onClick={handleEndSession}
          loading={ending}
          className="w-full"
        >
          {ending ? 'Mengakhiri sesi...' : 'Akhiri Sesi'}
        </Button>
      </div>
    </div>
  );
}
