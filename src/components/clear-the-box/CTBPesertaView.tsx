'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useCTBStore } from '@/stores/useCTBStore';
import type { BoxData } from '@/stores/useCTBStore';
import { CTBLayout } from './CTBLayout';
import { CTBBoxGrid } from './CTBBoxGrid';
import { CTBQuestionModal } from './CTBQuestionModal';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { matchAnswer } from '@/lib/utils/answer-matcher';
import { CheckCircle } from 'lucide-react';
import type { Question } from '@/types/database';

interface CTBPesertaViewProps {
  sessionId: string;
  quizId: string;
  participantId: string;
  nama: string;
}

export function CTBPesertaView({
  sessionId,
  quizId,
  participantId,
  nama,
}: CTBPesertaViewProps) {
  const {
    boxes,
    modalOpen,
    activeBoxId,
    setBoxes,
    openModal,
    closeModal,
    setBoxCleared,
    setBoxWrong,
    resetBoxStatus,
  } = useCTBStore();

  const [loading, setLoading] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [totalSoal, setTotalSoal] = useState(0);
  const [allCleared, setAllCleared] = useState(false);
  const wrongTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadGameState = useCallback(async () => {
    const supabase = createClient();

    // Load questions
    const { data: questions } = await supabase
      .from('questions')
      .select('id, teks_soal, pilihan_kiri, pilihan_kanan, sisi_benar, jawaban_benar, urutan')
      .eq('quiz_id', quizId)
      .order('urutan', { ascending: true });

    if (!questions) {
      setLoading(false);
      return;
    }

    setTotalSoal(questions.length);

    // Load existing answers for this participant
    const { data: answers } = await supabase
      .from('answers')
      .select('question_id, is_correct')
      .eq('participant_id', participantId)
      .eq('is_correct', true);

    const clearedQuestionIds = new Set(
      (answers ?? []).map((a) => a.question_id)
    );

    // Build boxes
    const boxData: BoxData[] = questions.map((q) => ({
      id: q.id,
      urutan: q.urutan,
      status: clearedQuestionIds.has(q.id) ? 'cleared' : 'normal',
      question: q as Question,
    }));

    setBoxes(boxData);
    setLoading(false);
  }, [quizId, participantId, setBoxes]);

  useEffect(() => {
    loadGameState();

    const supabase = createClient();

    // Check if session has ended
    const checkSession = async () => {
      const { data: session } = await supabase
        .from('sessions')
        .select('waktu_selesai')
        .eq('id', sessionId)
        .single();

      if (session?.waktu_selesai) {
        setGameEnded(true);
      }
    };

    checkSession();

    // Subscribe to session end
    const channel = supabase
      .channel(`ctb-peserta:${sessionId}`)
      .on('broadcast', { event: 'game_ended' }, () => {
        setGameEnded(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (wrongTimeoutRef.current) {
        clearTimeout(wrongTimeoutRef.current);
      }
    };
  }, [sessionId, loadGameState]);

  // Check if all boxes are cleared
  useEffect(() => {
    if (boxes.length > 0) {
      const allDone = boxes.every((box) => box.status === 'cleared');
      setAllCleared(allDone);
    }
  }, [boxes]);

  const handleSubmitAnswer = async (jawaban: string): Promise<boolean> => {
    if (!activeBoxId) return false;

    const activeBox = boxes.find((b) => b.id === activeBoxId);
    if (!activeBox || !activeBox.question.jawaban_benar) return false;

    const isCorrect = matchAnswer(jawaban, activeBox.question.jawaban_benar);

    const supabase = createClient();

    if (isCorrect) {
      // Save correct answer
      await supabase.from('answers').upsert(
        {
          participant_id: participantId,
          question_id: activeBoxId,
          is_correct: true,
        },
        { onConflict: 'participant_id,question_id,is_correct' }
      );
      setBoxCleared(activeBoxId);
    } else {
      // Save wrong attempt (for tracking)
      await supabase.from('answers').upsert(
        {
          participant_id: participantId,
          question_id: activeBoxId,
          is_correct: false,
        },
        { onConflict: 'participant_id,question_id,is_correct' }
      );
      setBoxWrong(activeBoxId);

      // Reset wrong status after a short delay
      if (wrongTimeoutRef.current) {
        clearTimeout(wrongTimeoutRef.current);
      }
      wrongTimeoutRef.current = setTimeout(() => {
        resetBoxStatus(activeBoxId);
        wrongTimeoutRef.current = null;
      }, 1500);
    }

    return isCorrect;
  };

  const handleBoxClick = (boxId: string) => {
    const box = boxes.find((b) => b.id === boxId);
    if (box && box.status !== 'cleared') {
      openModal(boxId);
    }
  };

  const activeBox = activeBoxId ? boxes.find((b) => b.id === activeBoxId) : null;

  if (loading) {
    return (
      <CTBLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted">Memuat soal...</p>
        </div>
      </CTBLayout>
    );
  }

  if (gameEnded) {
    return (
      <CTBLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Sesi Permainan Telah Berakhir
            </h1>
            <p className="text-muted">Terima kasih telah berpartisipasi!</p>
          </div>
        </div>
      </CTBLayout>
    );
  }

  return (
    <CTBLayout>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <Badge variant="outline" size="md">
          Clear The Box
        </Badge>
        <Badge variant="default" size="md">
          {nama}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {allCleared ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <CheckCircle className="w-16 h-16 text-correct" />
            <h2 className="text-2xl font-bold text-primary">
              Semua kotak telah dibersihkan!
            </h2>
            <p className="text-muted">
              Selamat, kamu telah menyelesaikan semua soal.
            </p>
          </div>
        ) : (
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  Pilih kotak untuk menjawab soal
                </h2>
                <Badge variant="outline" size="sm">
                  {boxes.filter((b) => b.status === 'cleared').length}/{totalSoal} selesai
                </Badge>
              </div>
              <CTBBoxGrid boxes={boxes} onBoxClick={handleBoxClick} />
            </div>
          </Card>
        )}
      </div>

      {/* Question Modal */}
      {activeBox && (
        <CTBQuestionModal
          open={modalOpen}
          onClose={closeModal}
          teksSoal={activeBox.question.teks_soal}
          onSubmit={handleSubmitAnswer}
        />
      )}
    </CTBLayout>
  );
}
