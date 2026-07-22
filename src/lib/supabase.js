import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hpsrvudjizfrivozcnyb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhwc3J2dWRqaXpmcml2b3pjbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NDU4MTUsImV4cCI6MjEwMDMyMTgxNX0.vt6z9ecf-0Q-j6eCSEIyFDUc6oyUpgI1tzE1a84tsjE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
