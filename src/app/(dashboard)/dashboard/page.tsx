import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Gamepad2, BarChart3, Trophy } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get creator name
  const { data: userData } = await supabase
    .from('users')
    .select('nama')
    .eq('id', user?.id ?? '')
    .single();

  // Get quiz count
  const { count: quizCount } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', user?.id ?? '');

  // Get active session count
  const { count: activeSessionCount } = await supabase
    .from('sessions')
    .select('*, quizzes!inner(creator_id)', { count: 'exact', head: true })
    .is('waktu_selesai', null)
    .eq('quizzes.creator_id', user?.id ?? '');

  const nama = userData?.nama ?? 'Creator';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Selamat Datang, {nama}!
        </h1>
        <p className="text-muted mt-1">
          Kelola quiz dan sesi permainan Anda di sini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-surface rounded-[12px]">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Quiz</p>
              <p className="text-2xl font-bold text-primary">
                {quizCount ?? 0}
              </p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-surface rounded-[12px]">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">Sesi Aktif</p>
              <p className="text-2xl font-bold text-primary">
                {activeSessionCount ?? 0}
              </p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-surface rounded-[12px]">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted">Status</p>
              <Badge variant="correct" size="md">Aktif</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
