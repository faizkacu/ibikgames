'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PTSTugOfWar } from './PTSTugOfWar';
import { PTSQuestion } from './PTSQuestion';
import { usePTSStore } from '@/stores/usePTSStore';
import type { TeamSide } from '@/stores/usePTSStore';

interface PTSQuestion {
  id: string;
  teks_soal: string;
  jawaban_benar: string | null;
  urutan: number;
}

interface PTSTeamViewProps {
  sessionId: string;
  quizId: string;
  team: TeamSide;
  nama: string;
}

export function PTSTeamView({
  sessionId,
  quizId,
  team,
  nama,
}: PTSTeamViewProps) {
  const [questions, setQuestions] = useState<PTSQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [endResult, setEndResult] = useState<{
    winner: TeamSide;
    score_a: number;
    score_b: number;
  } | null>(null);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>['channel']
  > | null>(null);

  const {
    teamScore,
    opponentScore,
    totalQuestions,
    currentQuestionIndex,
    isFinished,
    winner,
    setTotalQuestions,
    setCurrentQuestion,
    incrementScore,
    updateOpponentScore,
    finishGame,
  } = usePTSStore();

  const loadQuestions = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('questions')
      .select('id, teks_soal, jawaban_benar, urutan')
      .eq('quiz_id', quizId)
      .order('urutan', { ascending: true });

    if (data) {
      setQuestions(data);
      setTotalQuestions(data.length);
    }
    setLoading(false);
  }, [quizId, setTotalQuestions]);

  useEffect(() => {
    loadQuestions();

    const supabase = createClient();

    // Subscribe to broadcast events
    const channel = supabase
      .channel(`game:${sessionId}`)
      .on(
        'broadcast',
        { event: 'team_progress' },
        (payload: { payload: { team: string; score: number } }) => {
          const { team: eventTeam, score } = payload.payload;
          // Update opponent score if it's the other team
          if (eventTeam !== team) {
            updateOpponentScore(score);
          }
        }
      )
      .on(
        'broadcast',
        { event: 'game_ended' },
        (payload: { payload: { winner: string; score_a: number; score_b: number } }) => {
          const { winner: w, score_a, score_b } = payload.payload;
          setGameEnded(true);
          setEndResult({
            winner: w as TeamSide,
            score_a,
            score_b,
          });
          finishGame(w as TeamSide);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, team, loadQuestions, updateOpponentScore, finishGame]);

  const handleCorrectAnswer = async () => {
    const newScore = teamScore + 1;
    incrementScore();
    setCurrentQuestion(currentQuestionIndex + 1);

    // Broadcast progress
    const channel = channelRef.current;
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'team_progress',
        payload: { team, score: newScore },
      });
    }

    // Check win condition
    if (newScore >= totalQuestions) {
      finishGame(team);

      // Broadcast game ended
      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'game_ended',
          payload: {
            winner: team,
            score_a: team === 'tim_a' ? newScore : opponentScore,
            score_b: team === 'tim_b' ? newScore : opponentScore,
          },
        });
      }

      // Save match result
      const supabase = createClient();
      await supabase.from('match_results').insert({
        session_id: sessionId,
        skor_tim_a: team === 'tim_a' ? newScore : opponentScore,
        skor_tim_b: team === 'tim_b' ? newScore : opponentScore,
        tim_pemenang: team,
      });

      // End session
      await supabase
        .from('sessions')
        .update({ waktu_selesai: new Date().toISOString() })
        .eq('id', sessionId);

      await supabase
        .from('quizzes')
        .update({ is_active: false })
        .eq('id', quizId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Memuat soal...</p>
      </div>
    );
  }

  // Game ended screen
  if (gameEnded || isFinished) {
    const finalWinner = endResult?.winner ?? winner;
    const finalScoreA = endResult?.score_a ?? (team === 'tim_a' ? teamScore : opponentScore);
    const finalScoreB = endResult?.score_b ?? (team === 'tim_b' ? teamScore : opponentScore);
    const isWinner = finalWinner === team;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center space-y-4 py-8">
            <p className="text-sm text-muted uppercase tracking-wider">
              Pertandingan Selesai
            </p>
            <p className={`text-3xl font-bold ${isWinner ? 'text-correct' : 'text-wrong'}`}>
              {isWinner ? 'Kamu Menang!' : 'Kamu Kalah'}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-sm text-muted">Tim A</p>
                <p className="text-2xl font-bold text-primary">{finalScoreA}</p>
              </div>
              <span className="text-muted">-</span>
              <div className="text-center">
                <p className="text-sm text-muted">Tim B</p>
                <p className="text-2xl font-bold text-primary">{finalScoreB}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const displayName = team === 'tim_a' ? 'Tim A' : 'Tim B';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Badge variant="outline" size="md">
            {displayName}
          </Badge>
          <span className="text-sm text-muted">{nama}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-6">
        {/* Warning */}
        <Card>
          <p className="text-xs text-muted text-center">
            Pastikan koneksi internet stabil. Jika sesi terputus, progres tidak tersimpan.
          </p>
        </Card>

        {/* Question */}
        {currentQuestion && (
          <PTSQuestion
            teksSoal={currentQuestion.teks_soal}
            jawabanBenar={currentQuestion.jawaban_benar ?? ''}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            onCorrect={handleCorrectAnswer}
            isFinished={isFinished}
          />
        )}

        {/* Tug of War */}
        <Card>
          <PTSTugOfWar
            skorTimA={team === 'tim_a' ? teamScore : opponentScore}
            skorTimB={team === 'tim_b' ? teamScore : opponentScore}
            totalSoal={totalQuestions}
          />
        </Card>
      </div>
    </div>
  );
}
