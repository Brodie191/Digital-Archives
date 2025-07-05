import 'react-native-url-polyfill/auto';
import 'react-native-url-polyfill/auto';

// Log out the vars so we can confirm Expo loaded them
console.log('📦 Supabase ENV:',
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);


import { createClient } from '@supabase/supabase-js';

// You'll need to add these to your .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 