import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EditQuizForm } from './EditQuizForm';
import { ArrowLeft } from 'lucide-react';
import type { GameType } from '@/types/database';

interface EditGamePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*, questions(*)')
    .eq('id', id)
    .eq('creator_id', user?.id ?? '')
    .single();

  if (!quiz) {
    notFound();
  }

  const tipeGame = quiz.tipe_game as GameType;
  const sortedQuestions = (quiz.questions ?? []).sort(
    (a: { urutan: number }, b: { urutan: number }) => a.urutan - b.urutan
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href={`/games/${id}`}
        className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors duration-100"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-primary">Edit Quiz</h1>
        <p className="text-muted text-sm">Ubah nama quiz dan soal-soal.</p>
      </div>

      <Card>
        <EditQuizForm
          quizId={quiz.id}
          tipeGame={tipeGame}
          initialNamaQuiz={quiz.nama_quiz}
          initialQuestions={sortedQuestions.map(
            (q: {
              teks_soal: string;
              pilihan_kiri: string | null;
              pilihan_kanan: string | null;
              sisi_benar: string | null;
              jawaban_benar: string | null;
            }) => ({
              teks_soal: q.teks_soal,
              pilihan_kiri: q.pilihan_kiri ?? '',
              pilihan_kanan: q.pilihan_kanan ?? '',
              sisi_benar: (q.sisi_benar ?? 'kiri') as 'kiri' | 'kanan',
              jawaban_benar: q.jawaban_benar ?? '',
            })
          )}
        />
      </Card>
    </div>
  );
}
