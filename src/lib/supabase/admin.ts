/**
 * @title Supabase Admin Client (Server-Side Only)
 * @notice Supabase client with service role key for admin operations
 * @dev KISS principle: Simple initialization, write access for admin routes
 * @security ⚠️ NEVER import this in client-side code! Server-side only!
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    '[SECURITY] Missing Supabase admin credentials. ' +
    'Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
}

/**
 * Admin Supabase client (SERVER-SIDE ONLY)
 * ⚠️ WARNING: This client bypasses Row Level Security (RLS)
 *
 * Used for:
 * - Admin API routes (POST/DELETE/PATCH featured competitions)
 * - Server-side operations requiring full database access
 *
 * Security:
 * - Service role key MUST be kept secret
 * - NEVER expose this client to browser/client code
 * - Only use in API routes (app/api/*)
 * - Always verify admin wallet signature before using
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Security check helper
if (typeof window !== 'undefined') {
  console.error(
    '[SECURITY VIOLATION] supabaseAdmin imported in client-side code! ' +
    'This exposes the service role key. Remove this import immediately.'
  );
}
