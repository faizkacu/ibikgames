'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { matchAnswer } from '@/lib/utils/answer-matcher';
import { Send, ArrowRight } from 'lucide-react';
import { PLACEHOLDER_MESSAGES, ERROR_MESSAGES } from '@/lib/constants/messages';

interface PTSQuestionProps {
  teksSoal: string;
  jawabanBenar: string;
  questionNumber: number;
  totalQuestions: number;
  onCorrect: () => void;
  isFinished: boolean;
}

export function PTSQuestion({
  teksSoal,
  jawabanBenar,
  questionNumber,
  totalQuestions,
  onCorrect,
  isFinished,
}: PTSQuestionProps) {
  const [jawaban, setJawaban] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jawaban.trim()) {
      setError(ERROR_MESSAGES.FIELD_WAJIB);
      return;
    }

    setChecking(true);
    setError('');

    // Client-side validation
    const isCorrect = matchAnswer(jawaban, jawabanBenar);

    if (isCorrect) {
      onCorrect();
      setJawaban('');
    } else {
      setError(ERROR_MESSAGES.JAWABAN_SALAH);
    }

    setChecking(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-semibold text-correct">
          Semua soal telah diselesaikan!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Soal {questionNumber} dari {totalQuestions}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < questionNumber - 1
                  ? 'bg-correct'
                  : i === questionNumber - 1
                    ? 'bg-primary'
                    : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-surface rounded-[12px] p-6">
        <p className="text-lg font-semibold text-primary">{teksSoal}</p>
      </div>

      {/* Answer Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Jawaban Kamu"
          placeholder={PLACEHOLDER_MESSAGES.JAWABAN_BENAR}
          value={jawaban}
          onChange={(e) => {
            setJawaban(e.target.value);
            setError('');
          }}
          error={error}
          required
        />
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            loading={checking}
            icon={Send}
          >
            Jawab
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setJawaban('');
              setError('');
            }}
            icon={ArrowRight}
          >
            Lewati
          </Button>
        </div>
      </form>
    </div>
  );
}
