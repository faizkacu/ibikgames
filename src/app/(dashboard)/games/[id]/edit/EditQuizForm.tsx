'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuestionEditor } from '@/components/game/QuestionEditor';
import type { QuestionData } from '@/components/game/QuestionEditor';
import { Plus, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  PLACEHOLDER_MESSAGES,
} from '@/lib/constants/messages';
import type { GameType } from '@/types/database';

interface EditQuizFormProps {
  quizId: string;
  tipeGame: GameType;
  initialNamaQuiz: string;
  initialQuestions: QuestionData[];
}

export function EditQuizForm({
  quizId,
  tipeGame,
  initialNamaQuiz,
  initialQuestions,
}: EditQuizFormProps) {
  const router = useRouter();
  const [namaQuiz, setNamaQuiz] = useState(initialNamaQuiz);
  const [questions, setQuestions] = useState<QuestionData[]>(
    initialQuestions.length > 0
      ? initialQuestions
      : [{ teks_soal: '', pilihan_kiri: '', pilihan_kanan: '', sisi_benar: 'kiri', jawaban_benar: '' }]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nama_quiz?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!namaQuiz.trim()) newErrors.nama_quiz = ERROR_MESSAGES.FIELD_WAJIB;
    // Validate CTB questions have jawaban_benar
    if (tipeGame === 'clear_the_box') {
      const hasEmptyAnswer = questions.some(
        (q) => q.teks_soal.trim() && !q.jawaban_benar.trim()
      );
      if (hasEmptyAnswer) {
        toast.error('Semua soal harus memiliki jawaban benar.');
        return false;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { teks_soal: '', pilihan_kiri: '', pilihan_kanan: '', sisi_benar: 'kiri', jawaban_benar: '' },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, data: QuestionData) => {
    const updated = [...questions];
    updated[index] = data;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      // Update quiz name
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({ nama_quiz: namaQuiz.trim() })
        .eq('id', quizId);

      if (quizError) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Delete old questions
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', quizId);

      if (deleteError) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Insert new questions
      const validQuestions = questions.filter((q) => q.teks_soal.trim());
      if (validQuestions.length > 0) {
        const questionsToInsert = validQuestions.map((q, i) => {
          if (tipeGame === 'clear_the_box') {
            return {
              quiz_id: quizId,
              teks_soal: q.teks_soal.trim(),
              pilihan_kiri: null,
              pilihan_kanan: null,
              sisi_benar: null,
              jawaban_benar: q.jawaban_benar.trim(),
              urutan: i + 1,
            };
          }
          return {
            quiz_id: quizId,
            teks_soal: q.teks_soal.trim(),
            pilihan_kiri: q.pilihan_kiri.trim(),
            pilihan_kanan: q.pilihan_kanan.trim(),
            sisi_benar: q.sisi_benar,
            jawaban_benar: null,
            urutan: i + 1,
          };
        });

        const { error: insertError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (insertError) {
          toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
          return;
        }
      }

      toast.success(SUCCESS_MESSAGES.QUIZ_BERHASIL_DIUBAH);
      router.push(`/games/${quizId}`);
      router.refresh();
    } catch {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nama Quiz"
        placeholder={PLACEHOLDER_MESSAGES.NAMA_QUIZ}
        value={namaQuiz}
        onChange={(e) => setNamaQuiz(e.target.value)}
        error={errors.nama_quiz}
        required
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Daftar Soal ({questions.length})
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={addQuestion}
          >
            Tambah Soal
          </Button>
        </div>

        {questions.map((question, index) => (
          <QuestionEditor
            key={index}
            index={index}
            data={question}
            onChange={(data) => updateQuestion(index, data)}
            onRemove={() => removeQuestion(index)}
            canRemove={questions.length > 1}
            tipeGame={tipeGame}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" variant="primary" loading={loading} icon={Save}>
          {loading ? LOADING_MESSAGES.SIMPAN : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
