/**
 * Farcaster MiniApp configuration constants
 */

export const FARCASTER_CONFIG = {
  VERSION: '1',
  HOME_URL: '/fc',
  MANIFEST_PATH: '/.well-known/farcaster.json',
  SDK_READY_DELAY: 100, // ms
} as const;

export const FARCASTER_ROUTES = {
  HOME: '/fc',
  COMPETITION: (id: string) => `/fc/competition/${id}`,
} as const;
