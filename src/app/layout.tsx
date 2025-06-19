// src/app/layout.tsx
import '@/app/globals.css';
import { Bebas_Neue, Montserrat } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
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
        <header className="bg-black text-white p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <Image src="/Digital.svg" alt="Digital Archives Logo" width={56} height={56} priority />
            <h1 className="font-display text-3xl sm:text-5xl text-creme">
              Digital Archives
            </h1>
          </div>
          <nav className="space-x-4 flex justify-center sm:justify-end w-full sm:w-auto">
            <Link
              href="/"
              className="font-body uppercase tracking-wide text-sm font-bold px-4 py-2 min-w-[120px] bg-black text-creme border-2 border-creme rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-creme shadow flex items-center justify-center"
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className="font-body uppercase tracking-wide text-sm font-bold px-4 py-2 min-w-[120px] bg-black text-creme border-2 border-creme rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-creme shadow flex items-center justify-center"
            >
              Upload
            </Link>
          </nav>
        </header>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
