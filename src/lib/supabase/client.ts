/**
 * @title Supabase Client (Public Access)
 * @notice Browser-safe Supabase client with anon key
 * @dev KISS principle: Simple initialization, read-only access for public
 * @security Uses NEXT_PUBLIC_SUPABASE_ANON_KEY (safe for browser)
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

/**
 * Public Supabase client (browser-safe)
 * Used for:
 * - Reading featured competitions (public API)
 * - Client-side data fetching
 *
 * Security:
 * - Anon key only (no write access without RLS policies)
 * - Row Level Security (RLS) enforced on server
 */
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // No auth needed for public reads
    },
  }
);

// Test connection helper
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('featured_competitions')
      .select('count')
      .limit(1);

    if (error) {
      console.error('[Supabase Client] Connection test failed:', error);
      return false;
    }

    console.log('[Supabase Client] Connection successful');
    return true;
  } catch (error) {
    console.error('[Supabase Client] Connection error:', error);
    return false;
  }
}
