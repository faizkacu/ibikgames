import { Card } from '@/components/ui/Card';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export const metadata = {
  title: 'Daftar — IBIKGAMES',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-[12px] mb-4">
            <UserPlus className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">Daftar</h1>
          <p className="text-muted mt-1">
            Buat akun Creator baru
          </p>
        </div>

        <Card>
          <RegisterForm />
          <div className="mt-4 text-center text-sm text-muted">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Masuk
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
