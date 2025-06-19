'use client';

import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { Check, Loader2, X as XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';


interface Photo {
  name: string;
  id: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  // For lightroom navigation
  const [lightroomIndex, setLightroomIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      const { data, error } = await supabase
        .storage
        .from('photos')
        .list('', { limit: 100 });
  
      if (error) {
        console.error(error);
      } else {
        // Sort by the numeric timestamp at the start of each filename (newest first)
        const sorted = (data as Photo[]).sort((a, b) => {
          const aTs = Number(a.name.split('_')[0]);
          const bTs = Number(b.name.split('_')[0]);
          return bTs - aTs;
        });
        setPhotos(sorted);
      }
    }
    loadPhotos();
  }, []);
  

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-zinc-900 to-creme/20 p-4">
      <h1 className="text-creme font-retro text-3xl md:text-4xl mb-8 tracking-tight drop-shadow-lg">My Digital Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 opacity-70">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#f5f1e8" className="mb-4 animate-pulse"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0l-4 4a2 2 0 01-2.83 0L7 7" /></svg>
            <p className="text-creme text-lg font-body">No photos yet. Click the upload button to add your first photo!</p>
          </div>
        ) : (
          photos.map((photo, idx) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              openLightroom={() => setLightroomIndex(idx)}
            />
          ))
        )}
      </div>
      {/* Floating Upload Button */}
      <a href="/upload" className="fixed bottom-8 right-8 z-50 bg-white text-black shadow-retro rounded-full w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform ring-2 ring-black hover:ring-creme">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14M5 12h14" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Upload</span>
      </a>
      {/* Lightroom Dialog */}
      {lightroomIndex !== null && photos[lightroomIndex] && (
        <LightroomDialog
          photos={photos}
          index={lightroomIndex}
          setIndex={setLightroomIndex}
          close={() => setLightroomIndex(null)}
        />
      )}
    </div>
  );
}

function PhotoItem({ photo, openLightroom }: { photo: Photo, openLightroom?: () => void }) {
  // get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('photos').getPublicUrl(photo.name);

  return (
    <Card
      className="group overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105 shadow-retro hover:shadow-lg animate-fadeIn rounded-xl border border-creme/30 bg-black/70 backdrop-blur-md"
      onClick={openLightroom}
    >
      <Image
        src={publicUrl}
        alt={photo.name}
        width={300}
        height={300}
        className="object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
      />
      <div className="p-2 bg-creme text-black font-sans text-sm text-center truncate group-hover:underline group-hover:font-bold">
        {photo.name}
      </div>
    </Card>
  );
}

// Lightroom Dialog Component
function LightroomDialog({ photos, index, setIndex, close }: { photos: Photo[], index: number, setIndex: (i: number|null) => void, close: () => void }) {
  const photo = photos[index];
  const {
    data: { publicUrl },
  } = supabase.storage.from('photos').getPublicUrl(photo.name);

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1);
      if (e.key === 'ArrowRight' && index < photos.length - 1) setIndex(index + 1);
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, photos.length, setIndex, close]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        className="absolute top-4 right-4 text-creme bg-black/70 rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-creme"
        onClick={close}
        aria-label="Close"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {/* Left arrow */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-creme bg-black/70 rounded-full p-2 shadow disabled:opacity-30"
        onClick={() => setIndex(index - 1)}
        disabled={index === 0}
        aria-label="Previous"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
      </button>
      {/* Right arrow */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-creme bg-black/70 rounded-full p-2 shadow disabled:opacity-30"
        onClick={() => setIndex(index + 1)}
        disabled={index === photos.length - 1}
        aria-label="Next"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="flex flex-col items-center">
        <img
          src={publicUrl}
          alt={photo.name}
          className="max-h-[80vh] max-w-[90vw] rounded-lg border border-creme/20 shadow-lg"
        />
      </div>
    </div>
  );
}
