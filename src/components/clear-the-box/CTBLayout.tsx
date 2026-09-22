'use client';

import type { ReactNode } from 'react';

interface CTBLayoutProps {
  children: ReactNode;
}

export function CTBLayout({ children }: CTBLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {children}
    </div>
  );
}
