/**
 * Prize Win Notification Trigger
 *
 * @notice Sends push notification when user wins or claims a prize
 * @dev KISS principle: Simple trigger function to call after prize claim
 * @security Server-side only (uses notification sender)
 */

import { sendNotificationToUser } from '../sender';

interface PrizeWinData {
  userFid: number;
  competitionId: string;
  competitionName: string;
  prizeType?: string; // e.g., "1st Place", "Completion Prize"
}

/**
 * Send notification when user wins a prize
 *
 * @param data Prize win data
 * @returns Result of notification send
 *
 * @example
 * ```typescript
 * // After user claims prize (smart contract event or API call):
 * import { notifyPrizeWin } from '@/lib/farcaster/notification/triggers/prizeWin';
 *
 * // Get user's FID from your database
 * const userFid = await getUserFidByWallet(winnerAddress);
 *
 * if (userFid) {
 *   await notifyPrizeWin({
 *     userFid,
 *     competitionId: '123',
 *     competitionName: 'GeoArt Spring Collection',
 *     prizeType: '1st Place'
 *   });
 * }
 * ```
 */
export async function notifyPrizeWin(data: PrizeWinData) {
  try {
    console.log(`[Trigger] Sending prize win notification to FID ${data.userFid}`);

    const prizeText = data.prizeType ? ` - ${data.prizeType}` : '';

    const result = await sendNotificationToUser(data.userFid, {
      notificationId: `prize-win-${data.competitionId}-${data.userFid}`,
      title: '🏆 You Won a Prize!',
      body: `Congratulations! You won in ${data.competitionName}${prizeText}`,
      targetUrl: `https://challenge.geoart.studio/miniapps/competitions/${data.competitionId}/claim`
    });

    console.log(`[Trigger] Prize win notification sent:`, result.success);
    return result;

  } catch (error) {
    console.error('[Trigger] Failed to send prize win notification:', error);
    return { success: false, reason: 'send_failed' };
  }
}
