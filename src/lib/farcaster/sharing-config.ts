/**
 * @title Farcaster Sharing Configuration
 * @notice Centralized config for miniapp sharing metadata
 * @dev KISS principle: Single source of truth for sharing URLs
 * @dev Separate from config.ts (SDK) for better separation of concerns
 */

const PRODUCTION_URL = "https://challenge.geoart.studio";

export const FARCASTER_SHARING = {
  // App identity
  appName: "GeoChallenge",
  splashBackgroundColor: "#ffffff",

  // Asset URLs (absolute paths required by Farcaster)
  iconUrl: `${PRODUCTION_URL}/icon-512.png`,
  platformOgUrl: `${PRODUCTION_URL}/og.png`,

  // Dynamic OG API endpoint
  competitionOgApi: (id: string) => `${PRODUCTION_URL}/api/farcaster/competition/${id}/og`,

  // Page URLs
  homeUrl: `${PRODUCTION_URL}/miniapps`,
  competitionUrl: (id: string) => `${PRODUCTION_URL}/miniapps/competition/${id}`,

  // Button text (Farcaster max: 32 characters)
  platformButtonText: "Open GeoChallenge",
  competitionButtonText: "View Competition",
} as const;

/**
 * Helper to create Farcaster embed metadata
 * @param config Image URL, button title, and action URL
 * @param config.legacy If true, uses 'launch_frame' for backward compatibility. Default false (uses 'launch_miniapp')
 * @returns Farcaster embed object (for fc:miniapp meta tag)
 */
export function createFarcasterEmbed(config: {
  imageUrl: string;
  buttonTitle: string;
  actionUrl: string;
  legacy?: boolean;
}) {
  const actionType: "launch_frame" | "launch_miniapp" = config.legacy
    ? "launch_frame"
    : "launch_miniapp";

  return {
    version: "1",
    imageUrl: config.imageUrl,
    button: {
      title: config.buttonTitle,
      action: {
        type: actionType,
        name: FARCASTER_SHARING.appName,
        url: config.actionUrl,
        splashImageUrl: FARCASTER_SHARING.iconUrl,
        splashBackgroundColor: FARCASTER_SHARING.splashBackgroundColor,
      }
    }
  };
}
