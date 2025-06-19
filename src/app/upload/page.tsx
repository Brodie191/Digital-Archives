'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setUploaded(false);
  }

  async function handleUpload() {
    if (!file) return alert('Please select a file first.');
    setUploading(true);
    setUploaded(false);

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
    setUploaded(true);
    setFile(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-creme/20 p-4">
      <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-black/80 rounded-2xl shadow-retro border border-creme/20">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-creme hover:text-white font-bold"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex flex-col items-center mb-4">
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="#f5f1e8" className="mb-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0l-4 4a2 2 0 01-2.83 0L7 7" /></svg>
          <h2 className="font-retro text-2xl text-creme mb-1">Upload a Photo</h2>
          <p className="text-creme/80 font-body text-sm">Share your memories with the digital library</p>
        </div>
        {/* Styled file chooser and upload button, same width */}
        <div className="flex flex-col gap-4 w-full mb-4">
          <label
            className="relative w-full text-center font-display uppercase text-sm font-bold py-2 px-4 bg-creme text-black ring-2 ring-white rounded transition-all duration-300 ease-retro hover:bg-white hover:ring-creme hover:shadow-retro cursor-pointer"
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
          disabled={uploading || !file}
          style={{ backgroundColor: '#f5f1e8' }}
          className="w-full ring-2 ring-white hover:ring-creme transition ease-retro font-bold flex items-center justify-center gap-2 text-lg py-3"
        >
          {uploading ? (
            <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="4" fill="none" opacity="0.2" /><path d="M12 2a10 10 0 0 1 10 10" stroke="#222" strokeWidth="4" strokeLinecap="round" /></svg>
          ) : null}
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </Button>
        {uploaded && (
          <div className="mt-4 text-center text-green-400 font-body animate-fadeIn">Upload successful! 🎉</div>
        )}
      </div>
    </div>
  );
}
