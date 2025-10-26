/**
 * New Competition Launch Notification Trigger
 *
 * @notice Sends push notification when new competition is launched
 * @dev KISS principle: Simple trigger function to call after competition creation
 * @security Server-side only (uses notification sender)
 */

import { sendNotificationToAllUsers } from '../sender';

interface CompetitionData {
  id: string;
  name: string;
}

/**
 * Send notification when new competition launches
 *
 * @param competition Competition data
 * @returns Result of notification send
 *
 * @example
 * ```typescript
 * // In your admin API after creating competition:
 * import { notifyNewCompetition } from '@/lib/farcaster/notification/triggers/newCompetition';
 *
 * const competition = await supabaseAdmin
 *   .from('competitions')
 *   .insert({ name: "GeoArt Spring Collection", status: "active" })
 *   .select()
 *   .single();
 *
 * // Send notification to all users
 * await notifyNewCompetition({
 *   id: competition.data.id,
 *   name: competition.data.name
 * });
 * ```
 */
export async function notifyNewCompetition(competition: CompetitionData) {
  try {
    console.log(`[Trigger] Sending new competition notification: ${competition.name}`);

    const result = await sendNotificationToAllUsers({
      notificationId: `comp-launch-${competition.id}`,
      title: '🎉 New Competition Live!',
      body: `${competition.name} is now open. Start collecting cards!`,
      targetUrl: `https://challenge.geoart.studio/miniapps/competitions/${competition.id}`
    });

    console.log(`[Trigger] Notification sent to ${result.sent} users`);
    return result;

  } catch (error) {
    console.error('[Trigger] Failed to send new competition notification:', error);
    // Don't throw - notification failure shouldn't break competition creation
    return { success: false, sent: 0 };
  }
}
