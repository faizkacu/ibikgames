'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOADING_MESSAGES, PLACEHOLDER_MESSAGES } from '@/lib/constants/messages';
import { LogIn } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
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
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.BERHASIL_LOGIN);
      router.push('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        icon={LogIn}
      >
        {loading ? LOADING_MESSAGES.LOGIN : 'Masuk'}
      </Button>
    </form>
  );
}
