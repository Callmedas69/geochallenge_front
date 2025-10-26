/**
 * Farcaster Notification Sender
 *
 * @notice Send push notifications to users via Warpcast API
 * @dev KISS principle: Simple notification sending with security validation
 * @security Validates and sanitizes all user input to prevent XSS
 */

import { getAllEnabledTokens, getTokenByFid } from './storage';
import type { NotificationPayload, SendNotificationResult } from './types';

/**
 * Sanitize string to prevent XSS attacks
 * 🔒 Security: Remove HTML tags and special characters
 */
function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/[^\w\s\u{1F300}-\u{1F9FF}!?.,:-]/gu, '') // Keep alphanumeric, whitespace, emojis, basic punctuation
    .trim();
}

/**
 * Validate and sanitize notification payload
 * 🔒 Security: Validates + sanitizes all user input
 */
function validatePayload(payload: NotificationPayload): NotificationPayload {
  // 🔒 Security: Sanitize user-provided content first
  const sanitizedTitle = sanitizeString(payload.title);
  const sanitizedBody = sanitizeString(payload.body);

  // Title validation (Warpcast truncates at ~50 chars)
  if (!sanitizedTitle || sanitizedTitle.length === 0) {
    throw new Error('Title is required');
  }
  if (sanitizedTitle.length > 50) {
    throw new Error('Title too long (max 50 characters)');
  }

  // Body validation (Warpcast truncates at ~100 chars)
  if (!sanitizedBody || sanitizedBody.length === 0) {
    throw new Error('Body is required');
  }
  if (sanitizedBody.length > 100) {
    throw new Error('Body too long (max 100 characters)');
  }

  // Target URL validation (🔒 security: only allow your domain)
  if (!payload.targetUrl || !payload.targetUrl.startsWith('https://challenge.geoart.studio')) {
    throw new Error('Invalid target URL: must be challenge.geoart.studio domain');
  }

  // Notification ID validation
  if (!payload.notificationId || payload.notificationId.length === 0) {
    throw new Error('Notification ID is required');
  }

  // Return sanitized payload
  return {
    notificationId: payload.notificationId,
    title: sanitizedTitle,
    body: sanitizedBody,
    targetUrl: payload.targetUrl,
  };
}

/**
 * Split array into chunks
 */
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Send notification to all enabled users
 *
 * @param payload Notification payload
 * @returns Result with success status and count
 */
export async function sendNotificationToAllUsers(
  payload: NotificationPayload
): Promise<SendNotificationResult> {
  try {
    // 1. Validate and sanitize payload (🔒 security + data integrity)
    const validatedPayload = validatePayload(payload);

    // 2. Get all enabled tokens
    const tokens = await getAllEnabledTokens();

    if (tokens.length === 0) {
      console.log('[Notification] No enabled users to notify');
      return { success: true, sent: 0 };
    }

    console.log(`[Notification] Sending to ${tokens.length} users...`);

    // 3. Batch tokens (max 100 per request)
    const batches = chunk(tokens, 100);

    // 4. Send to each batch
    const results = await Promise.all(
      batches.map(async (batch) => {
        const notificationUrl = batch[0].url; // All tokens use same URL

        const response = await fetch(notificationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notificationId: validatedPayload.notificationId,
            title: validatedPayload.title,
            body: validatedPayload.body,
            targetUrl: validatedPayload.targetUrl,
            tokens: batch.map(t => t.token),
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error(`[Notification] Batch failed:`, error);
          return { success: false, count: 0 };
        }

        const result = await response.json();
        console.log(`[Notification] Batch sent: ${result.successCount || batch.length} users`);
        return { success: true, count: result.successCount || batch.length };
      })
    );

    // 5. Calculate total sent
    const totalSent = results.reduce((sum, r) => sum + r.count, 0);

    console.log(`[Notification] ✅ Total sent: ${totalSent}/${tokens.length}`);

    return { success: true, sent: totalSent };

  } catch (error) {
    console.error('[Notification] Send error:', error);
    throw error;
  }
}

/**
 * Send notification to specific FID
 *
 * @param fid Farcaster user ID
 * @param payload Notification payload
 * @returns Result with success status
 */
export async function sendNotificationToUser(
  fid: number,
  payload: NotificationPayload
): Promise<SendNotificationResult> {
  try {
    // 1. Validate and sanitize payload (🔒 security + data integrity)
    const validatedPayload = validatePayload(payload);

    // 2. Get token for user
    const token = await getTokenByFid(fid);

    if (!token || !token.enabled) {
      console.log(`[Notification] User ${fid} has no enabled token`);
      return { success: false, reason: 'no_token' };
    }

    const response = await fetch(token.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId: validatedPayload.notificationId,
        title: validatedPayload.title,
        body: validatedPayload.body,
        targetUrl: validatedPayload.targetUrl,
        tokens: [token.token],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[Notification] Failed to send to ${fid}:`, error);
      return { success: false, reason: 'send_failed' };
    }

    console.log(`[Notification] ✅ Sent to FID ${fid}`);
    return { success: true };

  } catch (error) {
    console.error(`[Notification] Error sending to ${fid}:`, error);
    throw error;
  }
}
