import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export const metadata = {
  title: 'Masuk — IBIKGAMES',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-[12px] mb-4">
            <LogIn className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">Masuk</h1>
          <p className="text-muted mt-1">
            Masuk ke akun Creator Anda
          </p>
        </div>

        <Card>
          <LoginForm />
          <div className="mt-4 text-center text-sm text-muted">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Daftar sekarang
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
