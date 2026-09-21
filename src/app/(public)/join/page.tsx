import { Card } from '@/components/ui/Card';
import { JoinForm } from '@/components/game/JoinForm';
import { Gamepad2 } from 'lucide-react';

export const metadata = {
  title: 'Gabung Sesi — IBIKGAMES',
};

export default function JoinPage() {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-[12px] mb-4">
            <Gamepad2 className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-2xl font-semibold text-primary">
            Gabung Sesi
          </h1>
          <p className="text-muted mt-1">
            Masukkan kode sesi dan nama kamu untuk bergabung.
          </p>
        </div>

        <Card>
          <JoinForm />
        </Card>
      </div>
    </div>
  );
}
