/**
 * Farcaster Notification Types
 *
 * @notice Type definitions for notification system
 * @dev KISS principle: Simple, clear interfaces
 */

/**
 * Notification payload sent to Warpcast API
 */
export interface NotificationPayload {
  notificationId: string;      // Unique ID for deduplication (e.g., "comp-launch-123")
  title: string;                // Notification title (max ~50 chars)
  body: string;                 // Notification body (max ~100 chars)
  targetUrl: string;            // URL to open when clicked
}

/**
 * Notification token stored in database
 */
export interface NotificationToken {
  fid: number;                  // Farcaster user ID
  token: string;                // Secret notification token
  url: string;                  // Warpcast notification endpoint
  enabled: boolean;             // Can user receive notifications?
}

/**
 * Webhook event from Farcaster
 */
export interface WebhookEvent {
  event: 'miniapp_added' | 'miniapp_removed' | 'notifications_enabled' | 'notifications_disabled';
  notificationDetails?: {
    token: string;
    url: string;
  };
}

/**
 * Send notification result
 */
export interface SendNotificationResult {
  success: boolean;
  sent?: number;                // Number of notifications sent
  reason?: string;              // Error reason if failed
}
