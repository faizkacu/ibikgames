'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, SkipForward } from 'lucide-react';
import { ERROR_MESSAGES } from '@/lib/constants/messages';

interface CTBQuestionModalProps {
  open: boolean;
  onClose: () => void;
  teksSoal: string;
  onSubmit: (jawaban: string) => Promise<boolean>;
}

export function CTBQuestionModal({
  open,
  onClose,
  teksSoal,
  onSubmit,
}: CTBQuestionModalProps) {
  const [jawaban, setJawaban] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jawaban.trim()) {
      setError(ERROR_MESSAGES.FIELD_WAJIB);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isCorrect = await onSubmit(jawaban.trim());
      if (isCorrect) {
        // Correct answer - close modal and reset
        setJawaban('');
        setError('');
        onClose();
      } else {
        // Wrong answer - show error, keep modal open
        setError(ERROR_MESSAGES.JAWABAN_SALAH);
      }
    } catch {
      setError(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setJawaban('');
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleSkip}
      title="Jawab Soal"
      size="md"
      closeOnOverlay={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question */}
        <div className="bg-surface rounded-card p-4">
          <p className="text-lg font-semibold text-primary">{teksSoal}</p>
        </div>

        {/* Answer Input */}
        <Input
          label="Jawaban Kamu"
          placeholder="Ketik jawaban kamu..."
          value={jawaban}
          onChange={(e) => {
            setJawaban(e.target.value);
            if (error) setError('');
          }}
          error={error}
          required
        />

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={Send}
            className="flex-1"
          >
            {loading ? 'Mengecek...' : 'Jawab'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            icon={SkipForward}
            onClick={handleSkip}
          >
            Lewati
          </Button>
        </div>
      </form>
    </Modal>
  );
}
