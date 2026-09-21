'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useGameStore } from '@/stores/useGameStore';
import { useCYSStore } from '@/stores/useCYSStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  StopCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants/messages';
import type { Question } from '@/types/database';

interface CYSCreatorViewProps {
  sessionId: string;
  quizId: string;
}

export function CYSCreatorView({
  sessionId,
  quizId,
}: CYSCreatorViewProps) {
  const {
    questions,
    currentIndex,
    totalQuestions,
    setQuestions,
    setSession,
    nextQuestion,
    prevQuestion,
    reset,
  } = useGameStore();
  const { isRevealed, reveal, resetReveal } = useCYSStore();
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>['channel']
  > | null>(null);
  const router = useRouter();

  // Load questions and setup channel
  useEffect(() => {
    const supabase = createClient();

    const loadQuestions = async () => {
      const { data } = await supabase
        .from('questions')
        .select('id, teks_soal, pilihan_kiri, pilihan_kanan, sisi_benar, jawaban_benar, urutan')
        .eq('quiz_id', quizId)
        .order('urutan', { ascending: true });

      if (data) {
        setQuestions(data as Question[]);
        setSession(sessionId, quizId);
      }
      setLoading(false);
    };

    loadQuestions();

    // Setup realtime channel
    const ch = supabase.channel(`game:${sessionId}`);
    ch.subscribe();
    channelRef.current = ch;

    return () => {
      supabase.removeChannel(ch);
      channelRef.current = null;
      reset();
    };
  }, [sessionId, quizId, setQuestions, setSession, reset]);

  const broadcastQuestion = useCallback(
    (index: number) => {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'question_update',
        payload: { questionIndex: index },
      });
    },
    []
  );

  const handleNext = () => {
    nextQuestion();
    resetReveal();
    broadcastQuestion(currentIndex + 1);
  };

  const handlePrev = () => {
    prevQuestion();
    resetReveal();
    broadcastQuestion(currentIndex - 1);
  };

  const handleReveal = () => {
    reveal();
    channelRef.current?.send({
      type: 'broadcast',
      event: 'answer_reveal',
      payload: {
        sisiBenar: questions[currentIndex]?.sisi_benar,
      },
    });
  };

  const handleEndSession = async () => {
    setEnding(true);
    const supabase = createClient();
    try {
      // Update session end time
      const { error: sessionError } = await supabase
        .from('sessions')
        .update({ waktu_selesai: new Date().toISOString() })
        .eq('id', sessionId);

      if (sessionError) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Set quiz inactive
      await supabase
        .from('quizzes')
        .update({ is_active: false })
        .eq('id', quizId);

      // Broadcast game ended
      channelRef.current?.send({
        type: 'broadcast',
        event: 'game_ended',
        payload: {},
      });

      toast.success(SUCCESS_MESSAGES.SESI_BERAKHIR);
      router.push('/games');
    } catch {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted">Memuat soal...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Quiz ini belum memiliki soal.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline" size="md">
          Soal {currentIndex + 1} dari {totalQuestions}
        </Badge>
        <Badge variant="default" size="md">
          Tampilan Creator
        </Badge>
      </div>

      {/* Question Display */}
      <div className="bg-secondary rounded-[12px] border border-border p-8">
        <h2 className="text-2xl font-semibold text-primary text-center mb-8">
          {currentQuestion.teks_soal}
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Option */}
          <div
            className={`p-8 rounded-[12px] border-2 text-center transition-colors duration-300 ${
              isRevealed && currentQuestion.sisi_benar === 'kiri'
                ? 'bg-correct-light border-correct text-correct'
                : isRevealed && currentQuestion.sisi_benar !== 'kiri'
                  ? 'bg-wrong-light border-wrong text-wrong'
                  : 'bg-surface border-border text-primary'
            }`}
          >
            <p className="text-xl font-medium">
              {currentQuestion.pilihan_kiri}
            </p>
          </div>

          {/* Right Option */}
          <div
            className={`p-8 rounded-[12px] border-2 text-center transition-colors duration-300 ${
              isRevealed && currentQuestion.sisi_benar === 'kanan'
                ? 'bg-correct-light border-correct text-correct'
                : isRevealed && currentQuestion.sisi_benar !== 'kanan'
                  ? 'bg-wrong-light border-wrong text-wrong'
                  : 'bg-surface border-border text-primary'
            }`}
          >
            <p className="text-xl font-medium">
              {currentQuestion.pilihan_kanan}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="secondary"
          icon={ChevronLeft}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Sebelumnya
        </Button>

        <Button
          variant="primary"
          icon={Eye}
          onClick={handleReveal}
          disabled={isRevealed}
        >
          Reveal Jawaban
        </Button>

        <Button
          variant="secondary"
          icon={ChevronRight}
          iconPosition="right"
          onClick={handleNext}
          disabled={currentIndex === totalQuestions - 1}
        >
          Selanjutnya
        </Button>
      </div>

      {/* End Session */}
      <div className="flex justify-center pt-4 border-t border-border">
        <Button
          variant="danger"
          icon={StopCircle}
          onClick={handleEndSession}
          loading={ending}
        >
          Akhiri Sesi
        </Button>
      </div>
    </div>
  );
}
