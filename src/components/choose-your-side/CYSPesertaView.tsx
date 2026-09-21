'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/Badge';
import type { Question, SideType } from '@/types/database';

interface CYSPesertaViewProps {
  sessionId: string;
  quizId: string;
  nama: string;
}

export function CYSPesertaView({
  sessionId,
  quizId,
  nama,
}: CYSPesertaViewProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sisiBenar, setSisiBenar] = useState<SideType | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Load questions
    const loadQuestions = async () => {
      const { data } = await supabase
        .from('questions')
        .select('id, teks_soal, pilihan_kiri, pilihan_kanan, sisi_benar, jawaban_benar, urutan')
        .eq('quiz_id', quizId)
        .order('urutan', { ascending: true });

      if (data) {
        setQuestions(data as Question[]);
      }
      setLoading(false);
    };

    loadQuestions();

    // Subscribe to realtime
    const channel = supabase.channel(`game:${sessionId}`);
    channel
      .on('broadcast', { event: 'question_update' }, (payload) => {
        const { questionIndex } = payload.payload as { questionIndex: number };
        setCurrentIndex(questionIndex);
        setIsRevealed(false);
        setSisiBenar(null);
      })
      .on('broadcast', { event: 'answer_reveal' }, (payload) => {
        const { sisiBenar: benar } = payload.payload as {
          sisiBenar: SideType;
        };
        setIsRevealed(true);
        setSisiBenar(benar);
      })
      .on('broadcast', { event: 'game_ended' }, () => {
        setGameEnded(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Memuat soal...</p>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Sesi Permainan Telah Berakhir
          </h1>
          <p className="text-muted">Terima kasih telah berpartisipasi!</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Menunggu soal pertama...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <Badge variant="outline" size="md">
          Soal {currentIndex + 1} dari {questions.length}
        </Badge>
        <Badge variant="default" size="md">
          {nama}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-semibold text-primary text-center mb-12">
          {currentQuestion.teks_soal}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Left */}
          <div
            className={`p-8 md:p-12 rounded-[12px] border-2 text-center transition-colors duration-300 ${
              isRevealed && sisiBenar === 'kiri'
                ? 'bg-correct-light border-correct text-correct'
                : isRevealed && sisiBenar !== 'kiri'
                  ? 'bg-wrong-light border-wrong text-wrong'
                  : 'bg-surface border-border text-primary'
            }`}
          >
            <p className="text-xl md:text-2xl font-medium">
              {currentQuestion.pilihan_kiri}
            </p>
          </div>

          {/* Right */}
          <div
            className={`p-8 md:p-12 rounded-[12px] border-2 text-center transition-colors duration-300 ${
              isRevealed && sisiBenar === 'kanan'
                ? 'bg-correct-light border-correct text-correct'
                : isRevealed && sisiBenar !== 'kanan'
                  ? 'bg-wrong-light border-wrong text-wrong'
                  : 'bg-surface border-border text-primary'
            }`}
          >
            <p className="text-xl md:text-2xl font-medium">
              {currentQuestion.pilihan_kanan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
