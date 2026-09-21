import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SessionCode } from './SessionCode';
import { GAME_TYPE_LABELS } from '@/lib/constants/game-types';
import type { GameType } from '@/types/database';
import { Gamepad2, Calendar } from 'lucide-react';

interface GameCardProps {
  quiz: {
    id: string;
    nama_quiz: string;
    tipe_game: GameType;
    kode_sesi: string;
    is_active: boolean;
    created_at: string;
  };
}

export function GameCard({ quiz }: GameCardProps) {
  const tipeLabel = GAME_TYPE_LABELS[quiz.tipe_game] ?? quiz.tipe_game;
  const formattedDate = new Date(quiz.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link href={`/games/${quiz.id}`}>
      <Card hover className="h-full">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary truncate">
                {quiz.nama_quiz}
              </h3>
            </div>
            {quiz.is_active && (
              <Badge variant="correct" size="sm">Aktif</Badge>
            )}
          </div>

          {/* Game Type */}
          <Badge variant="outline" size="sm">{tipeLabel}</Badge>

          {/* Session Code */}
          <SessionCode code={quiz.kode_sesi} />

          {/* Footer */}
          <div className="flex items-center gap-1 text-xs text-muted pt-2 border-t border-border">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>
      </Card>
    </Link>
  );
}
