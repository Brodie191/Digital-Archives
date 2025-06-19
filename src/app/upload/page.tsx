'use client';

import { Button } from '@/components/ui/button'; // adjust import/path as needed
import { Input } from '@/components/ui/input';
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
        console.error('Supabase Upload Error ->', error);
        alert(`Upload failed: ${error.message}`);
        return;
    }
  }
  
  return (
    <div className="max-w-md mx-auto space-y-4">
      <label className="block">
        <span className="text-creme font-retro mb-2 block">Select a photo</span>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading…' : 'Upload Photo'}
      </Button>
    </div>
  );
}
