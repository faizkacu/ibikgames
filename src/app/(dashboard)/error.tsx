'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-wrong mx-auto" />
        <h2 className="text-xl font-bold text-primary">
          Terjadi Kesalahan
        </h2>
        <p className="text-muted max-w-md mx-auto">
          Gagal memuat halaman. Pastikan koneksi internet stabil dan
          environment variables sudah dikonfigurasi di Netlify.
        </p>
        <Button variant="primary" icon={RefreshCw} onClick={reset}>
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
