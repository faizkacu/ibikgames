'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOADING_MESSAGES } from '@/lib/constants/messages';

interface DeleteQuizButtonProps {
  quizId: string;
  isActive: boolean;
}

export function DeleteQuizButton({ quizId, isActive }: DeleteQuizButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (isActive) {
      toast.error(ERROR_MESSAGES.QUIZ_SEDANG_AKTIF);
      setOpen(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(SUCCESS_MESSAGES.QUIZ_BERHASIL_DIHAPUS);
    setOpen(false);
    router.push('/games');
    router.refresh();
  };

  return (
    <>
      <Button
        variant="danger"
        icon={Trash2}
        onClick={() => setOpen(true)}
        disabled={isActive}
        title={
          isActive ? ERROR_MESSAGES.QUIZ_SEDANG_AKTIF : 'Hapus quiz'
        }
      >
        Hapus
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Hapus Quiz" size="sm">
        <div className="space-y-4">
          <p className="text-muted">
            Apakah Anda yakin ingin menghapus quiz ini? Tindakan ini tidak
            dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              loading={loading}
              icon={Trash2}
              onClick={handleDelete}
            >
              {loading ? LOADING_MESSAGES.MENGHAPUS : 'Hapus Quiz'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
