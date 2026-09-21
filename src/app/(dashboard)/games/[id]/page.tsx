import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SessionCode } from '@/components/game/SessionCode';
import { DeleteQuizButton } from './DeleteQuizButton';
import { Pencil, Play, ArrowLeft } from 'lucide-react';
import { GAME_TYPE_LABELS } from '@/lib/constants/game-types';
import { StartSessionButton } from '@/components/game/StartSessionButton';
import type { GameType } from '@/types/database';

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let quiz: {
    id: string;
    nama_quiz: string;
    tipe_game: string;
    kode_sesi: string;
    is_active: boolean;
    created_at: string;
    questions: {
      id: string;
      teks_soal: string;
      pilihan_kiri: string | null;
      pilihan_kanan: string | null;
      sisi_benar: string | null;
      urutan: number;
    }[];
  } | null = null;
  let hasActiveSession = false;
  let activeSessionId: string | null = null;

  if (user) {
    const { data } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', id)
      .eq('creator_id', user.id)
      .single();
    quiz = data;

    if (quiz) {
      const { data: activeSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('quiz_id', quiz.id)
        .is('waktu_selesai', null)
        .maybeSingle();
      hasActiveSession = !!activeSession;
      activeSessionId = activeSession?.id ?? null;
    }
  }

  if (!quiz) {
    notFound();
  }

  const tipeLabel =
    GAME_TYPE_LABELS[quiz.tipe_game as GameType] ?? quiz.tipe_game;
  const sortedQuestions = (quiz.questions ?? []).sort(
    (a: { urutan: number }, b: { urutan: number }) => a.urutan - b.urutan
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/games"
        className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors duration-100"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Quiz Info */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {quiz.nama_quiz}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{tipeLabel}</Badge>
                {quiz.is_active && (
                  <Badge variant="correct">Sesi Aktif</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Session Code */}
          <div>
            <p className="text-sm text-muted mb-1">Kode Sesi</p>
            <SessionCode code={quiz.kode_sesi} />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {!hasActiveSession && (
              <StartSessionButton quizId={quiz.id} />
            )}
            {hasActiveSession && activeSessionId && (
              <Link href={`/play/${activeSessionId}`}>
                <Button variant="primary" icon={Play}>
                  Lihat Sesi Aktif
                </Button>
              </Link>
            )}
            <Link href={`/games/${quiz.id}/edit`}>
              <Button variant="outline" icon={Pencil}>
                Edit
              </Button>
            </Link>
            <DeleteQuizButton
              quizId={quiz.id}
              isActive={quiz.is_active}
            />
          </div>
        </div>
      </Card>

      {/* Questions */}
      <div>
        <h2 className="text-lg font-semibold text-primary mb-4">
          Daftar Soal ({sortedQuestions.length})
        </h2>
        {sortedQuestions.length === 0 ? (
          <Card>
            <p className="text-muted text-center py-6">
              Belum ada soal.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedQuestions.map((q) => (
                <Card key={q.id} padding="sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted bg-surface px-2 py-0.5 rounded-sm">
                        {q.urutan}
                      </span>
                      <p className="font-medium text-primary">{q.teks_soal}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-8">
                      <div
                        className={`px-3 py-2 rounded-sm text-sm ${
                          q.sisi_benar === 'kiri'
                            ? 'bg-correct-light text-correct'
                            : 'bg-surface text-muted'
                        }`}
                      >
                        Kiri: {q.pilihan_kiri}
                      </div>
                      <div
                        className={`px-3 py-2 rounded-sm text-sm ${
                          q.sisi_benar === 'kanan'
                            ? 'bg-correct-light text-correct'
                            : 'bg-surface text-muted'
                        }`}
                      >
                        Kanan: {q.pilihan_kanan}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
