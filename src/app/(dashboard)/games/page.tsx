import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { GameCard } from '@/components/game/GameCard';
import { Plus, Gamepad2 } from 'lucide-react';
import { EMPTY_MESSAGES } from '@/lib/constants/messages';
import type { GameType } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let quizzes: {
    id: string;
    nama_quiz: string;
    tipe_game: GameType;
    kode_sesi: string;
    is_active: boolean;
    created_at: string;
  }[] | null = null;

  if (user) {
    const { data } = await supabase
      .from('quizzes')
      .select('id, nama_quiz, tipe_game, kode_sesi, is_active, created_at')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });
    quizzes = data;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Games</h1>
          <p className="text-muted text-sm">
            Kelola semua quiz yang telah Anda buat.
          </p>
        </div>
        <Link
          href="/games/new"
          className="inline-flex items-center justify-center gap-2 rounded-[12px] font-medium transition-all duration-200 cursor-pointer select-none bg-primary text-secondary hover:opacity-90 px-4 py-2 text-base h-10"
        >
          <Plus className="w-4 h-4" />
          Buat Quiz
        </Link>
      </div>

      {/* Quiz List */}
      {!quizzes || quizzes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Gamepad2 className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">{EMPTY_MESSAGES.BELUM_ADA_QUIZ}</p>
            <Link
              href="/games/new"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-[12px] font-medium transition-all duration-200 cursor-pointer select-none bg-primary text-secondary hover:opacity-90 px-4 py-2 text-base h-10"
            >
              <Plus className="w-4 h-4" />
              Buat Quiz Pertama
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <GameCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}
