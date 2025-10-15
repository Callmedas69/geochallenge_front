/**
 * Farcaster MiniApp configuration constants
 */

export const FARCASTER_CONFIG = {
  VERSION: '1',
  HOME_URL: '/miniapps',
  MANIFEST_PATH: '/.well-known/farcaster.json',
  SDK_READY_DELAY: 100, // ms
} as const;

export const FARCASTER_ROUTES = {
  HOME: '/miniapps',
  COMPETITION: (id: string) => `/miniapps/competition/${id}`,
} as const;
