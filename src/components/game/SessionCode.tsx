'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES } from '@/lib/constants/messages';

interface SessionCodeProps {
  code: string;
}

export function SessionCode({ code }: SessionCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(SUCCESS_MESSAGES.KODE_DISALIN);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin kode.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-lg font-bold text-primary tracking-wider">
        {code}
      </span>
      <button
        onClick={handleCopy}
        className="p-1 rounded-sm text-muted hover:text-primary hover:bg-surface transition-colors duration-100 cursor-pointer"
        title="Salin kode"
      >
        {copied ? (
          <Check className="w-4 h-4 text-correct" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
