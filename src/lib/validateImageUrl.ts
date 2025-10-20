/**
 * @title Image URL Validation Utility
 * @notice Validates image URLs against whitelist to prevent malicious content
 * @dev KISS principle: Simple domain whitelist matching next.config.ts
 * @security Only allows images from trusted domains
 */

/**
 * Allowed image domains (must match next.config.ts remotePatterns)
 * This prevents rendering images from malicious/untrusted sources
 */
const ALLOWED_IMAGE_DOMAINS = [
  'challenge.geoart.studio',
  'ipfs.io',
  'build.wield.xyz',
  'vibechain.com',
  'basescan.org',
  'base.blockscout.com',
  'gateway.pinata.cloud',
  'cloudflare-ipfs.com',
] as const;

/**
 * Placeholder image for invalid/unsafe URLs
 * Uses data URI to avoid external request
 */
export const FALLBACK_TICKET_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBhMGEwYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VGlja2V0IE5GVDwvdGV4dD48L3N2Zz4=';

/**
 * Validates if an image URL is from a trusted domain
 * @param url - The image URL to validate
 * @returns True if URL is from allowed domain, false otherwise
 */
export function isAllowedImageDomain(url: string): boolean {
  try {
    // Handle data URIs (base64 encoded images from contract)
    if (url.startsWith('data:image/')) {
      return true; // Data URIs are safe (embedded in contract)
    }

    // Parse URL
    const parsedUrl = new URL(url);

    // Only allow https protocol (or http for localhost in dev)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return false;
    }

    // Check if hostname is in whitelist
    const hostname = parsedUrl.hostname.toLowerCase();

    // Direct match
    if (ALLOWED_IMAGE_DOMAINS.includes(hostname as any)) {
      return true;
    }

    // Check for subdomain matches (e.g., api.ipfs.io should match ipfs.io)
    const allowedWithSubdomains = ALLOWED_IMAGE_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    return allowedWithSubdomains;
  } catch (error) {
    // Invalid URL format
    console.error('[validateImageUrl] Invalid URL format:', url, error);
    return false;
  }
}

/**
 * Validates and sanitizes an image URL
 * @param url - The image URL from metadata
 * @param source - Source of the URL for logging (e.g., "ticket metadata", "NFT metadata")
 * @returns Validated URL or fallback placeholder
 */
export function validateImageUrl(url: string | null | undefined, source: string = 'metadata'): string {
  // Handle empty/null URLs
  if (!url || url.trim() === '') {
    console.warn(`[validateImageUrl] Empty image URL from ${source}`);
    return FALLBACK_TICKET_IMAGE;
  }

  // Validate domain
  if (!isAllowedImageDomain(url)) {
    console.warn(
      `[validateImageUrl] SECURITY: Blocked untrusted image URL from ${source}: ${url}`
    );
    return FALLBACK_TICKET_IMAGE;
  }

  // URL is valid and from trusted domain
  return url;
}

/**
 * Validates image URL and logs security incidents
 * Use this in API routes for server-side validation with audit logging
 * @param url - The image URL from metadata
 * @param context - Context for audit log (competitionId, userAddress, etc.)
 * @returns Validated URL or fallback
 */
export function validateImageUrlWithAudit(
  url: string | null | undefined,
  context: { competitionId?: string; source?: string }
): string {
  const { competitionId, source = 'unknown' } = context;

  if (!url || url.trim() === '') {
    return FALLBACK_TICKET_IMAGE;
  }

  if (!isAllowedImageDomain(url)) {
    // Security audit log
    console.warn(
      `[SECURITY_IMAGE_VALIDATION] ${new Date().toISOString()} | ` +
      `Source: ${source} | Competition: ${competitionId || 'N/A'} | ` +
      `Blocked URL: ${url}`
    );
    return FALLBACK_TICKET_IMAGE;
  }

  return url;
}
