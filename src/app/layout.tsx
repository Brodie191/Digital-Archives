// src/app/layout.tsx
import '@/app/globals.css';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'My Photo Library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-black text-white font-sans">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="font-retro text-xl text-creme">Digital Archives</h1>
        <nav className="space-x-4">
        <Link href="/" className="text-white hover:text-creme">
          Gallery
        </Link>
        <Link href="/upload" className="text-white hover:text-creme">
          Upload
        </Link>
      </nav>
      </header>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
