import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'IBIKGAMES — Platform Game Edukasi Interaktif',
  description:
    'Platform game edukasi interaktif berbasis web untuk pembelajaran yang menyenangkan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'font-sans',
          }}
        />
      </body>
    </html>
  );
}
