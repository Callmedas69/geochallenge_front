/**
 * Farcaster Notification Storage
 *
 * @notice Database operations for notification tokens
 * @dev KISS principle: Simple CRUD operations using Supabase Admin
 * @security Uses service role key (server-side only)
 */

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { NotificationToken } from './types';

/**
 * Save or update notification token
 *
 * @param data Notification token data
 * @security Only accessible via supabaseAdmin (service role)
 */
export async function saveNotificationToken(data: NotificationToken): Promise<void> {
  const { error } = await (supabaseAdmin
    .from('farcaster_notification_tokens') as any)
    .upsert({
      fid: data.fid,
      token: data.token,
      url: data.url,
      enabled: data.enabled,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'fid', // Update if FID already exists
    });

  if (error) {
    console.error('[Storage] Save token error:', error);
    throw error;
  }
}

/**
 * Remove or disable notification token
 *
 * @param fid Farcaster user ID
 * @security Only accessible via supabaseAdmin (service role)
 */
export async function removeNotificationToken(fid: number): Promise<void> {
  const { error } = await (supabaseAdmin
    .from('farcaster_notification_tokens') as any)
    .update({ enabled: false, updated_at: new Date().toISOString() })
    .eq('fid', fid);

  if (error) {
    console.error('[Storage] Remove token error:', error);
    throw error;
  }
}

/**
 * Get all enabled notification tokens
 *
 * @returns Array of enabled notification tokens
 * @security Only accessible via supabaseAdmin (service role)
 */
export async function getAllEnabledTokens(): Promise<NotificationToken[]> {
  const { data, error } = await (supabaseAdmin
    .from('farcaster_notification_tokens') as any)
    .select('fid, token, url')
    .eq('enabled', true);

  if (error) {
    console.error('[Storage] Get tokens error:', error);
    throw error;
  }

  return (data || []).map((row: any) => ({
    fid: row.fid,
    token: row.token,
    url: row.url,
    enabled: true,
  }));
}

/**
 * Get token for specific FID
 *
 * @param fid Farcaster user ID
 * @returns Notification token or null if not found
 * @security Only accessible via supabaseAdmin (service role)
 */
export async function getTokenByFid(fid: number): Promise<NotificationToken | null> {
  const { data, error } = await (supabaseAdmin
    .from('farcaster_notification_tokens') as any)
    .select('fid, token, url, enabled')
    .eq('fid', fid)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('[Storage] Get token by FID error:', error);
    throw error;
  }

  return data ? {
    fid: data.fid,
    token: data.token,
    url: data.url,
    enabled: data.enabled,
  } : null;
}
