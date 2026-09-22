import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatisticsTable } from '@/components/game/StatisticsTable';
import { ArrowLeft } from 'lucide-react';
import { GAME_TYPE_LABELS } from '@/lib/constants/game-types';
import type { GameType } from '@/types/database';

interface StatisticsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (minutes > 0) {
    return `${minutes} menit ${secs} detik`;
  }
  return `${secs} detik`;
}

export default async function StatisticsPage({ params }: StatisticsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Get quiz info
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, nama_quiz, tipe_game')
    .eq('id', id)
    .eq('creator_id', user.id)
    .single();

  if (!quiz) {
    notFound();
  }

  const tipeLabel =
    GAME_TYPE_LABELS[quiz.tipe_game as GameType] ?? quiz.tipe_game;

  // Get all completed sessions for this quiz
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, waktu_mulai, waktu_selesai')
    .eq('quiz_id', id)
    .not('waktu_selesai', 'is', null)
    .order('waktu_mulai', { ascending: false });

  // Get total questions count
  const { count: totalSoal } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('quiz_id', id);

  // Build statistics for each session
  const sessionStats: Array<{
    sessionId: string;
    waktuMulai: string;
    waktuSelesai: string;
    durasi: string;
    participants: Array<{
      nama: string;
      skor: number;
      totalSoal: number;
      waktuPengerjaan: string;
    }>;
  }> = [];

  if (sessions) {
    for (const session of sessions) {
      // Get participants for this session
      const { data: participants } = await supabase
        .from('participants')
        .select('id, nama, joined_at')
        .eq('session_id', session.id);

      if (!participants || participants.length === 0) {
        sessionStats.push({
          sessionId: session.id,
          waktuMulai: session.waktu_mulai,
          waktuSelesai: session.waktu_selesai!,
          durasi: formatDuration(
            (new Date(session.waktu_selesai!).getTime() -
              new Date(session.waktu_mulai).getTime()) /
              1000
          ),
          participants: [],
        });
        continue;
      }

      // Get scores for each participant
      const participantIds = participants.map((p) => p.id);
      const { data: answers } = await supabase
        .from('answers')
        .select('participant_id, answered_at')
        .in('participant_id', participantIds)
        .eq('is_correct', true);

      const scoreMap = new Map<string, { count: number; lastAnswer: string }>();
      if (answers) {
        for (const answer of answers) {
          const current = scoreMap.get(answer.participant_id) ?? {
            count: 0,
            lastAnswer: answer.answered_at,
          };
          scoreMap.set(answer.participant_id, {
            count: current.count + 1,
            lastAnswer:
              answer.answered_at > current.lastAnswer
                ? answer.answered_at
                : current.lastAnswer,
          });
        }
      }

      const participantStats = participants
        .map((p) => {
          const scoreData = scoreMap.get(p.id);
          const skor = scoreData?.count ?? 0;
          const lastAnswer = scoreData?.lastAnswer ?? p.joined_at;
          const waktuPengerjaanMs =
            new Date(lastAnswer).getTime() - new Date(session.waktu_mulai).getTime();
          return {
            nama: p.nama,
            skor,
            totalSoal: totalSoal ?? 0,
            waktuPengerjaan: formatDuration(waktuPengerjaanMs / 1000),
          };
        })
        .sort((a, b) => b.skor - a.skor);

      sessionStats.push({
        sessionId: session.id,
        waktuMulai: session.waktu_mulai,
        waktuSelesai: session.waktu_selesai!,
        durasi: formatDuration(
          (new Date(session.waktu_selesai!).getTime() -
            new Date(session.waktu_mulai).getTime()) /
            1000
        ),
        participants: participantStats,
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href={`/games/${id}`}
        className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors duration-100"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Quiz Info */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Statistik</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted text-sm">{quiz.nama_quiz}</p>
          <Badge variant="outline">{tipeLabel}</Badge>
        </div>
      </div>

      {/* Sessions */}
      {sessionStats.length === 0 ? (
        <Card>
          <p className="text-muted text-center py-6">
            Belum ada sesi permainan yang selesai.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sessionStats.map((stat, index) => (
            <Card key={stat.sessionId}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-primary">
                    Sesi {sessionStats.length - index}
                  </h2>
                  <Badge variant="outline" size="sm">
                    Durasi: {stat.durasi}
                  </Badge>
                </div>
                <div className="text-sm text-muted">
                  <p>
                    Dimulai:{' '}
                    {new Date(stat.waktuMulai).toLocaleString('id-ID')}
                  </p>
                  <p>
                    Berakhir:{' '}
                    {new Date(stat.waktuSelesai).toLocaleString('id-ID')}
                  </p>
                </div>
                <StatisticsTable participants={stat.participants} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
