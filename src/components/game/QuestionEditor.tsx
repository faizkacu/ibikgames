'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2, GripVertical } from 'lucide-react';
import { PLACEHOLDER_MESSAGES } from '@/lib/constants/messages';
import { cn } from '@/lib/utils/cn';
import type { SideType, GameType } from '@/types/database';

export interface QuestionData {
  teks_soal: string;
  pilihan_kiri: string;
  pilihan_kanan: string;
  sisi_benar: SideType;
  jawaban_benar: string;
}

interface QuestionEditorProps {
  index: number;
  data: QuestionData;
  onChange: (data: QuestionData) => void;
  onRemove: () => void;
  canRemove: boolean;
  tipeGame?: GameType;
}

export function QuestionEditor({
  index,
  data,
  onChange,
  onRemove,
  canRemove,
  tipeGame = 'choose_your_side',
}: QuestionEditorProps) {
  return (
    <div className="bg-surface rounded-[12px] p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted" />
          <span className="text-sm font-semibold text-primary">
            Soal {index + 1}
          </span>
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={onRemove}
            className="text-muted hover:text-wrong"
          />
        )}
      </div>

      <div className="space-y-4">
        <Input
          label="Teks Soal"
          placeholder={PLACEHOLDER_MESSAGES.TEKS_SOAL}
          value={data.teks_soal}
          onChange={(e) => onChange({ ...data, teks_soal: e.target.value })}
          required
        />

        {tipeGame === 'choose_your_side' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Pilihan Kiri"
                placeholder={PLACEHOLDER_MESSAGES.PILIHAN_KIRI}
                value={data.pilihan_kiri}
                onChange={(e) =>
                  onChange({ ...data, pilihan_kiri: e.target.value })
                }
                required
              />
              <Input
                label="Pilihan Kanan"
                placeholder={PLACEHOLDER_MESSAGES.PILIHAN_KANAN}
                value={data.pilihan_kanan}
                onChange={(e) =>
                  onChange({ ...data, pilihan_kanan: e.target.value })
                }
                required
              />
            </div>

            {/* Correct Side Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-primary">
                Sisi yang Benar
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, sisi_benar: 'kiri' })}
                  className={cn(
                    'flex-1 py-2 px-4 rounded-[12px] text-sm font-medium border transition-colors duration-200 cursor-pointer',
                    data.sisi_benar === 'kiri'
                      ? 'bg-primary text-secondary border-primary'
                      : 'bg-secondary text-primary border-border hover:border-primary'
                  )}
                >
                  Kiri
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...data, sisi_benar: 'kanan' })}
                  className={cn(
                    'flex-1 py-2 px-4 rounded-[12px] text-sm font-medium border transition-colors duration-200 cursor-pointer',
                    data.sisi_benar === 'kanan'
                      ? 'bg-primary text-secondary border-primary'
                      : 'bg-secondary text-primary border-border hover:border-primary'
                  )}
                >
                  Kanan
                </button>
              </div>
            </div>
          </>
        ) : (
          <Input
            label="Jawaban Benar"
            placeholder={PLACEHOLDER_MESSAGES.JAWABAN_BENAR}
            value={data.jawaban_benar}
            onChange={(e) =>
              onChange({ ...data, jawaban_benar: e.target.value })
            }
            required
          />
        )}
      </div>
    </div>
  );
}
