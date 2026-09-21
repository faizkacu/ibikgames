'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOADING_MESSAGES, PLACEHOLDER_MESSAGES } from '@/lib/constants/messages';
import { UserPlus } from 'lucide-react';

export function RegisterForm() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    nama?: string;
    email?: string;
    password?: string;
  }>({});
  const { signUp } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!nama.trim()) newErrors.nama = ERROR_MESSAGES.FIELD_WAJIB;
    if (!email) newErrors.email = ERROR_MESSAGES.FIELD_WAJIB;
    else if (!email.includes('@')) newErrors.email = ERROR_MESSAGES.EMAIL_TIDAK_VALID;
    if (!password) newErrors.password = ERROR_MESSAGES.FIELD_WAJIB;
    else if (password.length < 8) newErrors.password = ERROR_MESSAGES.PASSWORD_PENDEK;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signUp(email, password, nama.trim());
    setLoading(false);

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.BERHASIL_REGISTER);
      router.push('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Lengkap"
        type="text"
        placeholder={PLACEHOLDER_MESSAGES.NAMA_LENGKAP}
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        error={errors.nama}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder={PLACEHOLDER_MESSAGES.EMAIL}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder={PLACEHOLDER_MESSAGES.PASSWORD}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={loading}
        icon={UserPlus}
      >
        {loading ? LOADING_MESSAGES.REGISTER : 'Daftar'}
      </Button>
    </form>
  );
}
