/**
 * Farcaster Notification Webhook Endpoint
 *
 * @notice Receives webhook events from Warpcast when users enable/disable notifications
 * @dev KISS principle: Simple webhook handler with security verification
 * @security Verifies webhook signatures using @farcaster/miniapp-node
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseWebhookEvent, verifyAppKeyWithNeynar } from '@farcaster/miniapp-node';
import { saveNotificationToken, removeNotificationToken } from '@/lib/farcaster/notification/storage';

/**
 * POST /api/farcaster/notification/webhook
 *
 * Handles 4 webhook events from Farcaster:
 * - miniapp_added: User adds miniapp (includes notification token)
 * - miniapp_removed: User removes miniapp (disable token)
 * - notifications_enabled: User re-enables notifications (new token)
 * - notifications_disabled: User disables notifications (disable token)
 *
 * @security Verifies webhook signature using Neynar API
 * @security Validates FID is positive integer
 * @security Returns 200 even on errors to prevent retry loops
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Get raw JSON from request
    const body = await request.text();
    const json = JSON.parse(body);

    // 2. Verify webhook signature (🔒 prevents fake webhooks)
    const event = await parseWebhookEvent(json, verifyAppKeyWithNeynar);

    // 3. Extract and validate FID
    const fid = event.fid;

    // 🔒 Security: Validate FID is a positive integer
    if (!fid || typeof fid !== 'number' || fid <= 0 || !Number.isInteger(fid)) {
      console.warn('[Webhook] Invalid FID:', fid);
      return NextResponse.json({ error: 'Invalid FID' }, { status: 200 });
    }

    // 4. Handle different event types
    switch (event.event.event) {
      case 'miniapp_added':
      case 'notifications_enabled':
        // Save notification token
        if (event.event.notificationDetails) {
          await saveNotificationToken({
            fid,
            token: event.event.notificationDetails.token,
            url: event.event.notificationDetails.url,
            enabled: true,
          });
          console.log(`✅ Notifications enabled for FID ${fid}`);
        }
        break;

      case 'miniapp_removed':
      case 'notifications_disabled':
        // Remove/disable notification token
        await removeNotificationToken(fid);
        console.log(`❌ Notifications disabled for FID ${fid}`);
        break;

      default:
        console.warn('[Webhook] Unknown event type');
    }

    // 5. Always return 200 (or Warpcast will retry)
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Webhook] Error:', error);

    // Return 200 even on error to prevent retries for invalid data
    // Only retry on server errors (5xx)
    if (error instanceof Error && error.name.includes('InvalidData')) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
