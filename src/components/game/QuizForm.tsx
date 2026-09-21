'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuestionEditor } from './QuestionEditor';
import { Plus, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  PLACEHOLDER_MESSAGES,
} from '@/lib/constants/messages';
import type { SideType, GameType } from '@/types/database';

interface QuestionData {
  teks_soal: string;
  pilihan_kiri: string;
  pilihan_kanan: string;
  sisi_benar: SideType;
}

interface QuizFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    id?: string;
    nama_quiz: string;
    tipe_game: GameType;
    questions: QuestionData[];
  };
}

export function QuizForm({ mode = 'create', initialData }: QuizFormProps) {
  const router = useRouter();
  const [namaQuiz, setNamaQuiz] = useState(initialData?.nama_quiz ?? '');
  const [questions, setQuestions] = useState<QuestionData[]>(
    initialData?.questions ?? [
      {
        teks_soal: '',
        pilihan_kiri: '',
        pilihan_kanan: '',
        sisi_benar: 'kiri',
      },
    ]
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nama_quiz?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!namaQuiz.trim()) {
      newErrors.nama_quiz = ERROR_MESSAGES.FIELD_WAJIB;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        teks_soal: '',
        pilihan_kiri: '',
        pilihan_kanan: '',
        sisi_benar: 'kiri',
      },
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Generate session code
      const { data: codeData, error: codeError } =
        await supabase.rpc('generate_session_code');
      if (codeError || !codeData) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({
          creator_id: user.id,
          nama_quiz: namaQuiz.trim(),
          tipe_game: 'choose_your_side',
          kode_sesi: codeData,
        })
        .select('id')
        .single();

      if (quizError || !quiz) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Create questions
      const validQuestions = questions.filter((q) => q.teks_soal.trim());
      if (validQuestions.length > 0) {
        const questionsToInsert = validQuestions.map((q, i) => ({
          quiz_id: quiz.id,
          teks_soal: q.teks_soal.trim(),
          pilihan_kiri: q.pilihan_kiri.trim(),
          pilihan_kanan: q.pilihan_kanan.trim(),
          sisi_benar: q.sisi_benar,
          urutan: i + 1,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) {
          toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
          return;
        }
      }

      toast.success(SUCCESS_MESSAGES.QUIZ_BERHASIL_DIBUAT);
      router.push('/games');
      router.refresh();
    } catch {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quiz Name */}
      <Input
        label="Nama Quiz"
        placeholder={PLACEHOLDER_MESSAGES.NAMA_QUIZ}
        value={namaQuiz}
        onChange={(e) => setNamaQuiz(e.target.value)}
        error={errors.nama_quiz}
        required
      />

      {/* Questions */}
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
          />
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={Save}
        >
          {loading
            ? LOADING_MESSAGES.SIMPAN
            : mode === 'edit'
              ? 'Simpan Perubahan'
              : 'Simpan Quiz'}
        </Button>
      </div>
    </form>
  );
}
