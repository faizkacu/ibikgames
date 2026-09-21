'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-secondary border-b border-border">
        <div className="flex items-center px-6 py-4">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden mr-4 p-1 text-primary cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xl font-bold text-primary">IBIKGAMES</span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
