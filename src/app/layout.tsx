// src/app/layout.tsx
import '@/app/globals.css';
import { Bebas_Neue, Montserrat } from 'next/font/google';
import Link from 'next/link';
import React from 'react';

const displayFont = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const bodyFont = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
});

export const metadata = {
  title: 'My Photo Library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="min-h-full bg-black text-white font-body">
        <header className="bg-black text-white p-4 flex justify-between items-center">
          <h1 className="font-display text-3xl sm:text-5xl text-creme">
            Digital Archives
          </h1>
          <p className="font-body text-base leading-relaxed">
            Browse or upload your snapshots
          </p>
          <nav className="space-x-4">
            <Link href="/" className="font-body uppercase tracking-wide text-sm hover:text-creme">
              Gallery
            </Link>
            <Link href="/upload" className="font-body uppercase tracking-wide text-sm hover:text-creme">
              Upload
            </Link>
          </nav>
        </header>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
