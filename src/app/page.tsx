'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LogIn, Gamepad2, Users, ArrowRight } from 'lucide-react';

const gameModes = [
  {
    title: 'Choose Your Side',
    description:
      'Soal dengan dua pilihan. Peserta bergerak secara fisik ke sisi jawaban yang mereka pilih.',
    badge: 'Mode Layar',
  },
  {
    title: 'Clear The Box',
    description:
      'Soal esai sebagai kotak-kotak. Peserta mengklik kotak, menjawab, dan kotak cleared jika benar.',
    badge: 'Mandiri',
  },
  {
    title: 'Pull The String',
    description:
      'Kompetisi 2 tim menjawab soal. Tim pertama yang selesai semua soal menang.',
    badge: 'Kompetisi Tim',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="default" size="md">
            Platform Game Edukasi
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mt-6 mb-6 leading-tight">
            Belajar Jadi Menyenangkan
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            IBIKGAMES adalah platform game edukasi interaktif yang memungkinkan
            Creator membuat quiz dalam berbagai mode permainan, dan Peserta
            bergabung secara live menggunakan kode sesi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Mulai Sekarang
              </Button>
            </Link>
            <Link href="/join">
              <Button variant="outline" size="lg" icon={Gamepad2}>
                Gabung Sesi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Tentang IBIKGAMES
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            IBIKGAMES menekankan pengalaman kolaboratif peserta dengan gerak
            tubuh dan kompetisi tim, bukan sekadar pilihan ganda statis. Creator
            memiliki kontrol penuh untuk membuat, mengelola, dan mengarahkan
            sesi permainan.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-primary text-center mb-8">
            Mode Permainan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gameModes.map((mode) => (
              <Card key={mode.title} hover padding="lg">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-primary">
                    {mode.title}
                  </h3>
                </div>
                <Badge variant="outline" size="sm">
                  {mode.badge}
                </Badge>
                <p className="text-muted mt-3 text-sm">{mode.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-secondary mb-4">
            Siap Membuat Quiz?
          </h2>
          <p className="text-muted-light mb-8">
            Daftar sekarang dan buat quiz pertama Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="secondary" size="lg" icon={Users}>
                Daftar Sebagai Creator
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                size="lg"
                icon={LogIn}
                className="text-secondary hover:text-primary"
              >
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
