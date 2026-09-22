'use client';

import { CTBBoxItem } from './CTBBoxItem';
import type { BoxData } from '@/stores/useCTBStore';

interface CTBBoxGridProps {
  boxes: BoxData[];
  onBoxClick: (boxId: string) => void;
}

function getGridCols(count: number): string {
  if (count <= 4) return 'grid-cols-2';
  if (count <= 8) return 'grid-cols-2 md:grid-cols-3';
  if (count <= 12) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
}

export function CTBBoxGrid({ boxes, onBoxClick }: CTBBoxGridProps) {
  const sortedBoxes = [...boxes].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className={`grid ${getGridCols(sortedBoxes.length)} gap-4`}>
      {sortedBoxes.map((box) => (
        <CTBBoxItem
          key={box.id}
          urutan={box.urutan}
          status={box.status}
          onClick={() => onBoxClick(box.id)}
        />
      ))}
    </div>
  );
}
