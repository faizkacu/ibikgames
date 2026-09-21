'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Play } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants/messages';

interface StartSessionButtonProps {
  quizId: string;
}

export function StartSessionButton({ quizId }: StartSessionButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      // Create new session
      const { data: session, error } = await supabase
        .from('sessions')
        .insert({ quiz_id: quizId })
        .select('id')
        .single();

      if (error || !session) {
        toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
        return;
      }

      // Set quiz active
      await supabase
        .from('quizzes')
        .update({ is_active: true })
        .eq('id', quizId);

      toast.success(SUCCESS_MESSAGES.SESI_DIMULAI);
      router.push(`/play/${session.id}`);
    } catch {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      icon={Play}
      onClick={handleStart}
      loading={loading}
    >
      Mulai Sesi
    </Button>
  );
}
