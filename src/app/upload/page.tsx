'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { ChangeEvent, useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function handleUpload() {
    if (!file) return alert('Please select a file first.');
    setUploading(true);

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase
      .storage
      .from('photos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    setUploading(false);

    if (error) {
      console.error('Supabase Upload Error →', error);
      alert(`Upload failed: ${error.message}`);
      return;
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-6 bg-black/50 rounded-lg shadow-retro">
      {/* Styled file chooser */}
      <div className="flex justify-center">
      <label
  className="
    relative inline-block w-full text-center
    font-display uppercase text-sm font-bold
    py-2 px-4
    bg-creme text-black
    ring-2 ring-white
    rounded
    transition-all duration-300 ease-retro
    hover:bg-white hover:ring-creme hover:shadow-retro
    cursor-pointerr
  "
  style={{ backgroundColor: '#f5f1e8' }}
>
  <span>Choose file: </span>
  <span className="font-body normal-case lowercase">
    {file ? file.name : 'no file selected'}
  </span>

  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
</label>
      </div>

      <Button
  onClick={handleUpload}
  disabled={uploading}
  style={{ backgroundColor: '#f5f1e8' }}
  className="w-full ring-2 ring-white hover:ring-creme transition ease-retro font-bold"
>
  {uploading ? 'Uploading…' : 'Upload Photo'}
</Button>
    </div>
  );
}
