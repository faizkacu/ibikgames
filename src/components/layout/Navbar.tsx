'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#services', label: 'Services' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          IBIKGAMES
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors duration-100',
                pathname === link.href
                  ? 'text-primary font-medium'
                  : 'text-muted hover:text-primary'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link href="/login">
            <Button variant="outline" size="sm" icon={LogIn}>
              Masuk
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-primary cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-secondary px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block text-sm py-2',
                pathname === link.href
                  ? 'text-primary font-medium'
                  : 'text-muted'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="outline" size="sm" className="w-full" icon={LogIn}>
              Masuk
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
