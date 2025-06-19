import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { oldName, newName } = await req.json();

  const { data: fileData, error: downloadError } = await supabaseAdmin
    .storage
    .from('photos')
    .download(oldName);
  if (downloadError) {
    console.error('Download error:', downloadError);
    return NextResponse.json({ error: downloadError.message }, { status: 400 });
  }

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from('photos')
    .upload(newName, fileData, { upsert: false });
  if (uploadError) {
    console.error('Upload (rename) error:', uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }


  const { error: removeError } = await supabaseAdmin
    .storage
    .from('photos')
    .remove([oldName]);
  if (removeError) {
    console.error('Remove old file error:', removeError);
    return NextResponse.json({ error: removeError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
