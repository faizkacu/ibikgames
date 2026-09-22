import { Card } from '@/components/ui/Card';
import { QuizForm } from '@/components/game/QuizForm';

export const metadata = {
  title: 'Buat Quiz Baru — IBIKGAMES',
};

export default function NewGamePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Buat Quiz Baru</h1>
        <p className="text-muted text-sm">
          Pilih tipe game dan buat soal-soal untuk quiz kamu.
        </p>
      </div>

      <Card>
        <QuizForm mode="create" />
      </Card>
    </div>
  );
}
