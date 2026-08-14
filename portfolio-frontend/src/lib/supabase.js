import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qmqsuthhkoxllgjnejvj.supabase.co';
export const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcXN1dGhoa294bGxnam5lanZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE2NDIsImV4cCI6MjA3NTc4NzY0Mn0.oUNPY9W_5W-anZc07jU8qb9GC19K7BYD3alL35Sn8jQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
