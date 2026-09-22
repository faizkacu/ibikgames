'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, Clock } from 'lucide-react';

interface ParticipantStat {
  nama: string;
  skor: number;
  totalSoal: number;
  waktuPengerjaan: string;
}

interface StatisticsTableProps {
  participants: ParticipantStat[];
}

export function StatisticsTable({ participants }: StatisticsTableProps) {
  if (participants.length === 0) {
    return (
      <Card>
        <p className="text-muted text-center py-6">
          Belum ada data statistik.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p, index) => (
        <Card key={`${p.nama}-${index}`} padding="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted bg-surface px-2 py-0.5 rounded-sm">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-primary">{p.nama}</p>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="w-3 h-3" />
                  <span>{p.waktuPengerjaan}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {index === 0 && p.skor > 0 && (
                <Trophy className="w-4 h-4 text-correct" />
              )}
              <Badge
                variant={p.skor === p.totalSoal ? 'correct' : 'outline'}
                size="sm"
              >
                {p.skor}/{p.totalSoal} box cleared
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
