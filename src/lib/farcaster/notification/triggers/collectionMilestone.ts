/**
 * Collection Milestone Notification Trigger
 *
 * @notice Sends push notification when user completes a rarity set
 * @dev KISS principle: Simple trigger function to call after set completion
 * @security Server-side only (uses notification sender)
 */

import { sendNotificationToUser } from '../sender';

interface MilestoneData {
  userFid: number;
  rarityTier: string; // e.g., "Common", "Rare", "Legendary"
  cardsCompleted: number;
  totalCards?: number;
}

/**
 * Send notification when user completes a collection milestone
 *
 * @param data Milestone data
 * @returns Result of notification send
 *
 * @example
 * ```typescript
 * // After user opens pack and completes a rarity set:
 * import { notifyCollectionMilestone } from '@/lib/farcaster/notification/triggers/collectionMilestone';
 *
 * const userFid = await getUserFidByWallet(userAddress);
 *
 * if (completedRaritySet && userFid) {
 *   await notifyCollectionMilestone({
 *     userFid,
 *     rarityTier: 'Legendary',
 *     cardsCompleted: 10,
 *     totalCards: 10
 *   });
 * }
 * ```
 */
export async function notifyCollectionMilestone(data: MilestoneData) {
  try {
    console.log(`[Trigger] Sending milestone notification to FID ${data.userFid} for ${data.rarityTier}`);

    const result = await sendNotificationToUser(data.userFid, {
      notificationId: `milestone-${data.userFid}-${data.rarityTier}-${Date.now()}`,
      title: '🎨 Collection Complete!',
      body: `You completed the ${data.rarityTier} set! Keep collecting!`,
      targetUrl: `https://challenge.geoart.studio/miniapps/collection`
    });

    console.log(`[Trigger] Milestone notification sent:`, result.success);
    return result;

  } catch (error) {
    console.error('[Trigger] Failed to send milestone notification:', error);
    return { success: false, reason: 'send_failed' };
  }
}
