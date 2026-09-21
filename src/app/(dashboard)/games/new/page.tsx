import { Card } from '@/components/ui/Card';
import { QuizForm } from '@/components/game/QuizForm';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Buat Quiz Baru — IBIKGAMES',
};

export default function NewGamePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Buat Quiz Baru</h1>
        <p className="text-muted text-sm">
          Buat quiz Choose Your Side dengan soal-soal pilihan kiri dan kanan.
        </p>
      </div>

      <Card>
        <QuizForm mode="create" />
      </Card>
    </div>
  );
}
