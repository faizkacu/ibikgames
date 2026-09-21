import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SessionCode } from '@/components/game/SessionCode';
import { GameCard } from '@/components/game/GameCard';
import { Plus, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import type { GameType } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  const results: Record<string, string> = {};

  // Test 1: Basic rendering
  results['1_basic'] = 'OK';

  // Test 2: Supabase
  let user: { id: string; email: string } | null = null;
  try {
    const supabase = await createClient();
    const { data: { user: u }, error } = await supabase.auth.getUser();
    user = u as typeof user;
    results['2_auth'] = user ? `OK: ${user.email}` : `null: ${error?.message}`;
  } catch (e) {
    results['2_auth'] = `ERROR: ${e}`;
  }

  // Test 3: Query
  let quizzes: { id: string; nama_quiz: string; tipe_game: string; kode_sesi: string; is_active: boolean; created_at: string }[] | null = null;
  if (user) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, nama_quiz, tipe_game, kode_sesi, is_active, created_at')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      quizzes = data;
      results['3_query'] = `OK: ${quizzes?.length ?? 0} quizzes, error: ${error?.message ?? 'none'}`;
    } catch (e) {
      results['3_query'] = `ERROR: ${e}`;
    }
  }

  const hasQuizzes = quizzes && quizzes.length > 0;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Component Test</h1>

      {/* Debug info */}
      <pre className="bg-gray-100 p-4 text-sm rounded">
        {JSON.stringify(results, null, 2)}
      </pre>

      {/* Test Card */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Test: Card</h2>
        <Card>
          <p>Card content works</p>
        </Card>
      </section>

      {/* Test Badge */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Test: Badge</h2>
        <Badge variant="outline">Badge text</Badge>
      </section>

      {/* Test Button */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Test: Button with icon</h2>
        <Button variant="primary" icon={Plus}>Buat Quiz</Button>
      </section>

      {/* Test SessionCode */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Test: SessionCode</h2>
        <SessionCode code="123456" />
      </section>

      {/* Test Link + Button */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Test: Link wrapping Button</h2>
        <Link href="/games/new">
          <Button variant="primary" icon={Plus}>Buat Quiz Pertama</Button>
        </Link>
      </section>

      {/* Test GameCard */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Test: GameCard (static)</h2>
        <GameCard quiz={{
          id: 'test-123',
          nama_quiz: 'Test Quiz',
          tipe_game: 'choose_your_side' as GameType,
          kode_sesi: '123456',
          is_active: false,
          created_at: new Date().toISOString(),
        }} />
      </section>

      {/* Test actual games list */}
      {user && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Test: Actual quiz list</h2>
          {!hasQuizzes ? (
            <Card>
              <div className="text-center py-12">
                <Gamepad2 className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted">Belum ada quiz. Buat quiz pertamamu!</p>
                <Link href="/games/new" className="mt-4 inline-block">
                  <Button variant="primary" icon={Plus}>
                    Buat Quiz Pertama
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <GameCard key={quiz.id} quiz={{...quiz, tipe_game: quiz.tipe_game as GameType}} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
