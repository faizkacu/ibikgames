'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES } from '@/lib/constants/messages';

export function useAuth() {
  const router = useRouter();
  const { setUser, setLoading, reset } = useAuthStore();

  const signUp = useCallback(
    async (email: string, password: string, nama: string) => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nama },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            return { success: false, error: ERROR_MESSAGES.EMAIL_SUDAH_TERDAFTAR };
          }
          return { success: false, error: error.message };
        }

        setUser(data.user);
        return { success: true };
      } catch {
        return { success: false, error: ERROR_MESSAGES.TERJADI_KESALAHAN };
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: ERROR_MESSAGES.PASSWORD_SALAH };
        }

        setUser(data.user);
        return { success: true };
      } catch {
        return { success: false, error: ERROR_MESSAGES.TERJADI_KESALAHAN };
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: ERROR_MESSAGES.TERJADI_KESALAHAN };
      }
      reset();
      router.push('/login');
      return { success: true };
    } catch {
      return { success: false, error: ERROR_MESSAGES.TERJADI_KESALAHAN };
    } finally {
      setLoading(false);
    }
  }, [setLoading, reset, router]);

  const getUser = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }, []);

  return { signUp, signIn, signOut, getUser } as const;
}
