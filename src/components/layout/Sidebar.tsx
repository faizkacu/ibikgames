'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Gamepad2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants/messages';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: Gamepad2,
    label: 'Games',
    href: '/games',
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(ERROR_MESSAGES.TERJADI_KESALAHAN);
      return;
    }
    toast.success(SUCCESS_MESSAGES.BERHASIL_LOGOUT);
    router.push('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-60 bg-secondary border-r border-border pt-[73px]',
          'transition-transform duration-200 ease-out',
          'md:translate-x-0 md:sticky md:top-0 md:h-[calc(100vh-73px)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-[12px] text-sm transition-colors duration-100',
                  isActive
                    ? 'text-primary bg-surface font-medium'
                    : 'text-muted hover:text-primary hover:bg-surface'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-[12px] text-sm text-muted hover:text-primary hover:bg-surface transition-colors duration-100 w-full cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
