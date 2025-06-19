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
import { useEffect, useState } from 'react';

interface Photo {
  name: string;
  id: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

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
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-creme font-retro text-2xl mb-6">My Digital Library</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}

function PhotoItem({ photo }: { photo: Photo }) {
  // dialog rename state
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(photo.name);
  const [saving, setSaving]   = useState(false);

  // get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('photos').getPublicUrl(photo.name);

  // handle rename
  async function handleRenameSave() {
    if (newName === photo.name) {
      setIsRenaming(false);
      return;
    }

    let finalName = newName;
    if (!newName.includes('.')) {
      const ext = photo.name.split('.').pop();
      finalName = `${newName}.${ext}`;
    }

    setSaving(true);
    // Call our server-side rename endpoint
    const res = await fetch('/api/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName: photo.name, newName: finalName }),
    });
    const { error } = await res.json();
  
    setSaving(false);
  
    if (error) {
      alert('Rename failed: ' + error);
    } else {
      alert(`Renamed to ${finalName}`);
      window.location.reload();
    }
    
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105 shadow-md hover:shadow-retro animate-fadeIn">
          <Image
            src={publicUrl}
            alt={photo.name}
            width={300}
            height={300}
            className="object-cover w-full h-48"
          />
          <div className="p-2 bg-creme text-black font-sans text-sm text-center truncate group-hover:underline group-hover:font-bold">
            {photo.name}
          </div>
        </Card>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />

        <DialogContent className="fixed top-1/2 left-1/2 
+     -translate-x-1/2 -translate-y-1/2
+     max-w-3xl bg-black ring-2 ring-creme rounded-lg p-4 shadow-retro
+ ">
          <DialogHeader className="flex items-center justify-between">
            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  className="bg-black text-white border border-creme rounded px-2 py-1 flex-grow"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button
                  disabled={saving}
                  onClick={handleRenameSave}
                  className="p-1"
                >
                  {saving
                    ? <Loader2 className="animate-spin" size={16} />
                    : <Check size={16} />}
                </button>
                <button
                  onClick={() => {
                    setNewName(photo.name);
                    setIsRenaming(false);
                  }}
                  className="p-1"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <DialogTitle className="text-creme font-retro text-lg">
                  {photo.name}
                </DialogTitle>
                <button
                  onClick={() => setIsRenaming(true)}
                  className="text-creme hover:text-white p-1"
                >
                  ✎
                </button>
              </div>
            )}
          </DialogHeader>

          <div className="mt-4">
            <Image
              src={publicUrl}
              alt={photo.name}
              width={800}
              height={600}
              className="max-h-[80vh] w-full object-contain"
            />
          </div>

          <DialogClose className="absolute top-3 right-3 text-creme hover:text-white">
            ✕
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
